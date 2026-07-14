import hashlib
import logging
from typing import List, Dict, Any
from pypdf import PdfReader
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.rag.pipeline import db_collection

logger = logging.getLogger(__name__)

def get_file_hash(file_bytes: bytes) -> str:
    return hashlib.md5(file_bytes).hexdigest()

def process_and_index_pdf(file_bytes: bytes, filename: str) -> int:
    """
    Reads a PDF, extracts text content, splits it into chunks,
    generates embeddings, and ingests them into the ChromaDB.
    Returns the number of chunks successfully indexed.
    """
    try:
        reader = PdfReader(bytes_io_from_bytes(file_bytes))
        text_content = ""
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                text_content += f"\n--- Page {i+1} ---\n{text}"
        
        if not text_content.strip():
            logger.warning(f"No text extracted from PDF: {filename}")
            return 0
            
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=750,
            chunk_overlap=150,
            length_function=len
        )
        chunks = text_splitter.split_text(text_content)
        
        if not chunks:
            return 0
            
        # Store in ChromaDB
        documents = []
        metadatas = []
        ids = []
        
        file_hash = get_file_hash(file_bytes)
        
        for idx, chunk in enumerate(chunks):
            documents.append(chunk)
            metadatas.append({
                "source": "user_upload",
                "filename": filename,
                "file_hash": file_hash,
                "chunk_index": idx,
                "page": _find_page_number(chunk)
            })
            ids.append(f"pdf_{file_hash}_{idx}")
            
        db_collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Indexed {len(chunks)} chunks from PDF: {filename}")
        return len(chunks)
        
    except Exception as e:
        logger.error(f"Error processing PDF {filename}: {e}")
        raise e

def bytes_io_from_bytes(data: bytes):
    import io
    return io.BytesIO(data)

def _find_page_number(chunk: str) -> int:
    # Try to find a page marker like "--- Page X ---" in the text chunk
    import re
    match = re.search(r'---\s*Page\s*(\d+)\s*---', chunk)
    if match:
        return int(match.group(1))
    return 1

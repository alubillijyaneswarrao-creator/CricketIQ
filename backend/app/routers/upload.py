from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import IngestedDocument
from app.schemas.schemas import DocumentResponse
from app.utils.pdf import process_and_index_pdf, get_file_hash

router = APIRouter(prefix="/api/documents", tags=["Document Upload"])

@router.post("/upload", response_model=DocumentResponse)
async def upload_pdf_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF documents are supported.")
        
    try:
        file_bytes = await file.read()
        file_hash = get_file_hash(file_bytes)
        
        # Check if file is already uploaded
        existing_doc = db.query(IngestedDocument).filter(IngestedDocument.file_hash == file_hash).first()
        if existing_doc:
            return existing_doc

        # Process and index in ChromaDB
        chunk_count = process_and_index_pdf(file_bytes, file.filename)
        
        if chunk_count == 0:
            raise HTTPException(status_code=400, detail="Failed to extract readable text from PDF.")

        # Save to database
        db_doc = IngestedDocument(
            filename=file.filename,
            file_hash=file_hash,
            chunk_count=chunk_count
        )
        db.add(db_doc)
        db.commit()
        db.refresh(db_doc)
        
        return db_doc
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process and index PDF: {e}")

@router.get("/", response_model=List[DocumentResponse])
def list_uploaded_documents(db: Session = Depends(get_db)):
    return db.query(IngestedDocument).order_by(IngestedDocument.uploaded_at.desc()).all()

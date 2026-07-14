import logging
from sqlalchemy.orm import Session
from app.models.models import Player, Match

logger = logging.getLogger(__name__)

def seed_database(db: Session):
    # Check if database is already seeded
    if db.query(Player).count() > 0:
        logger.info("Database already seeded with players.")
        return

    logger.info("Seeding database with cricket intelligence data...")

    # Define Players
    players_data = [
        {
            "name": "Virat Kohli",
            "country": "India",
            "role": "Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm medium",
            "image_url": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/gpt/players/253802.png",
            "icc_rankings": {"Test": 8, "ODI": 3, "T20I": 45},
            "bio": "Virat Kohli is an Indian international cricketer and former captain of the Indian national cricket team. Widely regarded as one of the greatest batsmen in the history of the sport, he plays for Royal Challengers Bangalore in the IPL and Delhi in domestic cricket.",
            "stats": {
                "Test": {"matches": 113, "runs": 8848, "average": 49.15, "strike_rate": 55.56, "hundreds": 29, "fifties": 30, "highest_score": "254*"},
                "ODI": {"matches": 292, "runs": 13848, "average": 58.67, "strike_rate": 93.54, "hundreds": 50, "fifties": 72, "highest_score": "183"},
                "T20I": {"matches": 125, "runs": 4188, "average": 48.69, "strike_rate": 137.04, "hundreds": 1, "fifties": 38, "highest_score": "122*"}
            },
            "recent_form": [
                {"opponent": "Australia", "format": "ODI", "runs": 54, "balls": 63},
                {"opponent": "South Africa", "format": "Test", "runs": 76, "balls": 110},
                {"opponent": "South Africa", "format": "Test", "runs": 46, "balls": 68},
                {"opponent": "Afghanistan", "format": "T20I", "runs": 29, "balls": 16},
                {"opponent": "England", "format": "Test", "runs": 112, "balls": 182}
            ],
            "timeline": [
                {"year": "2008", "event": "Led India to Under-19 World Cup victory and made senior international debut."},
                {"year": "2011", "event": "Won the ICC Cricket World Cup with India, scoring a century in his debut match."},
                {"year": "2014", "event": "Appointed India's Test captain, succeeding MS Dhoni."},
                {"year": "2017", "event": "Took over as limited-overs captain; led India to Champions Trophy final."},
                {"year": "2023", "event": "Broke Sachin Tendulkar's record with his 50th ODI century during the World Cup semi-final."}
            ],
            "ai_summary": "Virat Kohli is the ultimate chase-master in modern-day cricket, possessing unmatched mental strength and a flawless batting technique. His transition from an aggressive youngster to one of the most structured builders of innings is legendary. He averages near 60 in ODI run-chases, underlining his status as one of the best finishers under pressure."
        },
        {
            "name": "Joe Root",
            "country": "England",
            "role": "Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm offbreak",
            "image_url": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/gpt/players/303669.png",
            "icc_rankings": {"Test": 2, "ODI": 24, "T20I": 98},
            "bio": "Joseph Edward Root is an English cricketer who plays for the England cricket team and previously captained their Test team. He is widely considered one of the finest Test batters of the modern era, forming part of the 'Fab Four'.",
            "stats": {
                "Test": {"matches": 140, "runs": 11736, "average": 49.72, "strike_rate": 56.88, "hundreds": 31, "fifties": 61, "highest_score": "254"},
                "ODI": {"matches": 171, "runs": 6522, "average": 47.60, "strike_rate": 86.82, "hundreds": 16, "fifties": 39, "highest_score": "133*"},
                "T20I": {"matches": 32, "runs": 893, "average": 35.72, "strike_rate": 126.30, "hundreds": 0, "fifties": 5, "highest_score": "90*"}
            },
            "recent_form": [
                {"opponent": "India", "format": "Test", "runs": 29, "balls": 60},
                {"opponent": "India", "format": "Test", "runs": 122, "balls": 274},
                {"opponent": "West Indies", "format": "Test", "runs": 68, "balls": 112},
                {"opponent": "West Indies", "format": "Test", "runs": 14, "balls": 30},
                {"opponent": "Sri Lanka", "format": "Test", "runs": 143, "balls": 206}
            ],
            "timeline": [
                {"year": "2012", "event": "Made Test debut in India, showing immediate competence against spin."},
                {"year": "2015", "event": "Scored 460 runs in the Ashes, leading England to a 3-2 victory."},
                {"year": "2017", "event": "Appointed Test captain of England."},
                {"year": "2019", "event": "Won the ICC Cricket World Cup at Lord's as England's leading run-scorer."},
                {"year": "2021", "event": "Scored six Test centuries in a calendar year, winning ICC Men's Cricketer of the Year."}
            ],
            "ai_summary": "Joe Root is a masterclass of spin-bowling counterplay and rotation. Uniquely skilled at sweeping, reverse-sweeping, and manipulating gaps, he anchors England's batting lineup. While he has adopted England's aggressive 'Bazball' approach, his core strength remains his methodical accumulator mindset, particularly in the longer format."
        },
        {
            "name": "Babar Azam",
            "country": "Pakistan",
            "role": "Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm offbreak",
            "image_url": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/gpt/players/348144.png",
            "icc_rankings": {"Test": 5, "ODI": 1, "T20I": 4},
            "bio": "Mohammad Babar Azam is a Pakistani cricketer and current captain of the Pakistan national cricket team in limited overs formats. Known for his elegant cover drives and consistency, he is ranked among the top batsmen globally.",
            "stats": {
                "Test": {"matches": 52, "runs": 3898, "average": 45.85, "strike_rate": 54.89, "hundreds": 9, "fifties": 26, "highest_score": "196"},
                "ODI": {"matches": 117, "runs": 5729, "average": 56.72, "strike_rate": 88.75, "hundreds": 19, "fifties": 32, "highest_score": "158"},
                "T20I": {"matches": 119, "runs": 4145, "average": 41.03, "strike_rate": 129.08, "hundreds": 3, "fifties": 36, "highest_score": "122"}
            },
            "recent_form": [
                {"opponent": "New Zealand", "format": "T20I", "runs": 57, "balls": 43},
                {"opponent": "New Zealand", "format": "T20I", "runs": 66, "balls": 37},
                {"opponent": "Ireland", "format": "T20I", "runs": 75, "balls": 42},
                {"opponent": "USA", "format": "T20I", "runs": 44, "balls": 43},
                {"opponent": "India", "format": "T20I", "runs": 13, "balls": 10}
            ],
            "timeline": [
                {"year": "2015", "event": "Made ODI debut against Zimbabwe, scoring a half-century."},
                {"year": "2018", "event": "Scored maiden Test century against New Zealand in Dubai."},
                {"year": "2020", "event": "Appointed captain of the Pakistan national team across all formats."},
                {"year": "2021", "event": "Overtook Virat Kohli to become the No. 1 ODI batsman in the ICC rankings."},
                {"year": "2022", "event": "Led Pakistan to the finals of both the Asia Cup and T20 World Cup."}
            ],
            "ai_summary": "Babar Azam's cover drive is arguably the most aesthetically pleasing shot in modern cricket. He possesses extreme consistency in white-ball cricket and relies on classical strokeplay rather than brute force. He anchors Pakistan's batting, acting as the structural hub around which quick scorers play."
        },
        {
            "name": "Jasprit Bumrah",
            "country": "India",
            "role": "Bowler",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm fast",
            "image_url": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/gpt/players/625383.png",
            "icc_rankings": {"Test": 1, "ODI": 2, "T20I": 10},
            "bio": "Jasprit Jasbirsingh Bumrah is an Indian cricketer who plays for the Indian national team. With an unusual hyper-extension release and unmatched tactical versatility, he is regarded as one of the best death bowlers in cricket history.",
            "stats": {
                "Test": {"matches": 36, "wickets": 159, "average": 20.69, "economy": 2.74, "five_wickets": 10, "best_bowling": "6/27"},
                "ODI": {"matches": 89, "wickets": 149, "average": 23.55, "economy": 4.59, "five_wickets": 2, "best_bowling": "6/19"},
                "T20I": {"matches": 62, "wickets": 74, "average": 19.66, "economy": 6.55, "five_wickets": 0, "best_bowling": "3/11"}
            },
            "recent_form": [
                {"opponent": "England", "format": "Test", "wickets": 6, "runs": 45, "overs": 15.5},
                {"opponent": "Pakistan", "format": "T20I", "wickets": 3, "runs": 14, "overs": 4},
                {"opponent": "USA", "format": "T20I", "wickets": 0, "runs": 25, "overs": 4},
                {"opponent": "Australia", "format": "T20I", "wickets": 1, "runs": 29, "overs": 4},
                {"opponent": "South Africa", "format": "T20I", "wickets": 2, "runs": 18, "overs": 4}
            ],
            "timeline": [
                {"year": "2013", "event": "Discovered by Mumbai Indians, debuting with a 3-wicket haul."},
                {"year": "2016", "event": "Made international debut during the Australia series, finishing as leading T20 wicket-taker."},
                {"year": "2018", "event": "Made Test debut in South Africa, asserting himself instantly as an all-format specialist."},
                {"year": "2019", "event": "Took a hat-trick in Test matches against the West Indies."},
                {"year": "2024", "event": "Named Player of the Tournament in T20 World Cup 2024, leading India to victory with a tournament economy of 4.17."}
            ],
            "ai_summary": "Jasprit Bumrah is a generational talent. His unique release, which occurs closer to the batsman due to a hyper-extended elbow, creates extreme pace and late movement. What truly separates him is his cricketing brain: he uses off-cutters, slower balls, bouncers, and yorkers at will, making him virtually un-hittable at the death."
        },
        {
            "name": "MS Dhoni",
            "country": "India",
            "role": "Wicketkeeper Batter",
            "batting_style": "Right-hand bat",
            "bowling_style": "Right-arm medium",
            "image_url": "https://img1.hscicdn.com/image/upload/f_auto,t_ds_square_w_320,q_50/gpt/players/28081.png",
            "icc_rankings": {"Test": 0, "ODI": 0, "T20I": 0},
            "bio": "Mahendra Singh Dhoni is a former Indian professional cricketer who captained the Indian national team in limited-overs formats from 2007 to 2017 and in Test cricket from 2008 to 2014. He is the only captain to win all three ICC trophies.",
            "stats": {
                "Test": {"matches": 90, "runs": 4876, "average": 38.09, "strike_rate": 59.11, "hundreds": 6, "fifties": 33, "highest_score": "224"},
                "ODI": {"matches": 350, "runs": 10773, "average": 50.57, "strike_rate": 87.56, "hundreds": 10, "fifties": 73, "highest_score": "183*"},
                "T20I": {"matches": 98, "runs": 1617, "average": 37.60, "strike_rate": 126.13, "hundreds": 0, "fifties": 2, "highest_score": "56"}
            },
            "recent_form": [
                {"opponent": "Mumbai Indians", "format": "T20", "runs": 20, "balls": 4},
                {"opponent": "Lucknow Super Giants", "format": "T20", "runs": 28, "balls": 9},
                {"opponent": "Delhi Capitals", "format": "T20", "runs": 37, "balls": 16},
                {"opponent": "Sunrisers Hyderabad", "format": "T20", "runs": 5, "balls": 2},
                {"opponent": "Royal Challengers", "format": "T20", "runs": 25, "balls": 13}
            ],
            "timeline": [
                {"year": "2004", "event": "Made ODI debut against Bangladesh, rising to fame shortly after with a blazing 148 against Pakistan."},
                {"year": "2007", "event": "Led a young Indian side to the inaugural ICC World Twenty20 championship in South Africa."},
                {"year": "2011", "event": "Hit the famous match-winning six to win the ICC Cricket World Cup at Wankhede Stadium."},
                {"year": "2013", "event": "Won the ICC Champions Trophy, becoming the first captain to hold all major ICC white-ball trophies."},
                {"year": "2020", "event": "Announced retirement from international cricket; continues leading Chennai Super Kings."}
            ],
            "ai_summary": "MS Dhoni is celebrated as the epitome of calm under extreme pressure ('Captain Cool'). As a batsman, he revolutionized the finisher role, waiting out bowlers to launch death-over onslaughts. Behind the stumps, his lightning-fast stumpings and strategic guidance to spinners remain unmatched."
        }
    ]

    for p_data in players_data:
        db.add(Player(**p_data))

    # Define Matches (Completed & Live)
    completed_match_card = {
        "title": "India vs Australia - 2023 ICC World Cup Final",
        "team_a": "India",
        "team_b": "Australia",
        "status": "completed",
        "format": "ODI",
        "date": "2023-11-19",
        "venue": "Narendra Modi Stadium, Ahmedabad",
        "summary": "Australia clinched their sixth ICC Cricket World Cup title with a dominant six-wicket victory over India. Travis Head starred with a brilliant 137 off 120 balls, guiding Australia through a tense chase of 241. India struggled to find momentum after Virat Kohli and KL Rahul's steady rebuilding phase, falling to a below-par score on a sluggish surface.",
        "scorecard": {
            "innings_1": {
                "team": "India",
                "score": "240",
                "wickets": "10",
                "overs": "50.0",
                "batting": [
                    {"name": "Rohit Sharma", "status": "c Head b Maxwell", "runs": 47, "balls": 31, "fours": 4, "sixes": 3, "sr": 151.61},
                    {"name": "Shubman Gill", "status": "c Zampa b Starc", "runs": 4, "balls": 7, "fours": 0, "sixes": 0, "sr": 57.14},
                    {"name": "Virat Kohli", "status": "b Cummins", "runs": 54, "balls": 63, "fours": 4, "sixes": 0, "sr": 85.71},
                    {"name": "Shreyas Iyer", "status": "c Inglis b Cummins", "runs": 4, "balls": 3, "fours": 1, "sixes": 0, "sr": 133.33},
                    {"name": "KL Rahul", "status": "c Inglis b Starc", "runs": 66, "balls": 107, "fours": 1, "sixes": 0, "sr": 61.68},
                    {"name": "Ravindra Jadeja", "status": "c Inglis b Hazlewood", "runs": 9, "balls": 22, "fours": 0, "sixes": 0, "sr": 40.91}
                ],
                "bowling": [
                    {"name": "Mitchell Starc", "overs": "10.0", "maidens": 0, "runs": 55, "wickets": 3, "economy": 5.50},
                    {"name": "Josh Hazlewood", "overs": "10.0", "maidens": 0, "runs": 60, "wickets": 2, "economy": 6.00},
                    {"name": "Glenn Maxwell", "overs": "6.0", "maidens": 0, "runs": 35, "wickets": 1, "economy": 5.83},
                    {"name": "Pat Cummins", "overs": "10.0", "maidens": 0, "runs": 34, "wickets": 2, "economy": 3.40},
                    {"name": "Adam Zampa", "overs": "10.0", "maidens": 0, "runs": 44, "wickets": 1, "economy": 4.40}
                ]
            },
            "innings_2": {
                "team": "Australia",
                "score": "241",
                "wickets": "4",
                "overs": "43.0",
                "batting": [
                    {"name": "Travis Head", "status": "c Gill b Siraj", "runs": 137, "balls": 120, "fours": 15, "sixes": 4, "sr": 114.17},
                    {"name": "David Warner", "status": "c Gill b Shami", "runs": 7, "balls": 3, "fours": 1, "sixes": 0, "sr": 233.33},
                    {"name": "Mitchell Marsh", "status": "c Rahul b Bumrah", "runs": 15, "balls": 15, "fours": 1, "sixes": 1, "sr": 100.00},
                    {"name": "Steve Smith", "status": "lbw b Bumrah", "runs": 4, "balls": 9, "fours": 1, "sixes": 0, "sr": 44.44},
                    {"name": "Marnus Labuschagne", "status": "not out", "runs": 58, "balls": 110, "fours": 4, "sixes": 0, "sr": 52.73},
                    {"name": "Glenn Maxwell", "status": "not out", "runs": 2, "balls": 1, "fours": 0, "sixes": 0, "sr": 200.00}
                ],
                "bowling": [
                    {"name": "Jasprit Bumrah", "overs": "9.0", "maidens": 2, "runs": 43, "wickets": 2, "economy": 4.77},
                    {"name": "Mohammed Shami", "overs": "7.0", "maidens": 1, "runs": 47, "wickets": 1, "economy": 6.71},
                    {"name": "Ravindra Jadeja", "overs": "10.0", "maidens": 0, "runs": 43, "wickets": 0, "economy": 4.30},
                    {"name": "Kuldeep Yadav", "overs": "5.1", "maidens": 0, "runs": 56, "wickets": 0, "economy": 10.84},
                    {"name": "Mohammed Siraj", "overs": "7.0", "maidens": 0, "runs": 45, "wickets": 1, "economy": 6.42}
                ]
            }
        },
        "charts_data": {
            "worm_graph": [
                {"over": 5, "team_a_runs": 40, "team_b_runs": 30},
                {"over": 10, "team_a_runs": 80, "team_b_runs": 47},
                {"over": 15, "team_a_runs": 97, "team_b_runs": 65},
                {"over": 20, "team_a_runs": 115, "team_b_runs": 95},
                {"over": 25, "team_a_runs": 135, "team_b_runs": 125},
                {"over": 30, "team_a_runs": 160, "team_b_runs": 150},
                {"over": 35, "team_a_runs": 182, "team_b_runs": 185},
                {"over": 40, "team_a_runs": 211, "team_b_runs": 225},
                {"over": 45, "team_a_runs": 228, "team_b_runs": 241},
                {"over": 50, "team_a_runs": 240, "team_b_runs": 241}
            ],
            "partnership": [
                {"players": "T. Head & M. Labuschagne", "runs": 192, "balls": 215, "team": "Australia"},
                {"players": "V. Kohli & K.L. Rahul", "runs": 67, "balls": 109, "team": "India"},
                {"players": "R. Sharma & V. Kohli", "runs": 46, "balls": 32, "team": "India"}
            ]
        },
        "turning_points": [
            "Travis Head's spectacular running catch to dismiss Rohit Sharma in the 10th over, checking India's flying start.",
            "Pat Cummins bowling Virat Kohli (54) just as India attempted to shift into higher gears.",
            "Travis Head and Marnus Labuschagne rebuilding Australia from 47/3 with an unbroken 192-run stand."
        ],
        "momentum_data": [
            {"over": 5, "intensity": 85},
            {"over": 10, "intensity": -60},
            {"over": 15, "intensity": -40},
            {"over": 20, "intensity": -10},
            {"over": 25, "intensity": 30},
            {"over": 30, "intensity": 50},
            {"over": 35, "intensity": 90},
            {"over": 40, "intensity": 95},
            {"over": 43, "intensity": 100}
        ],
        "predictions": {
            "win_probability_final": {"India": 0.0, "Australia": 100.0}
        }
    }

    live_match_card = {
        "title": "India vs Pakistan - ICC Men's T20 World Cup Super 8s",
        "team_a": "India",
        "team_b": "Pakistan",
        "status": "live",
        "format": "T20I",
        "date": "2026-06-16",
        "venue": "Kensington Oval, Bridgetown, Barbados",
        "summary": "A high-octane live battle in the Super 8s. Pakistan has won the toss and elected to bowl. India is batting first.",
        "scorecard": {
            "innings_1": {
                "team": "India",
                "score": "154",
                "wickets": "6",
                "overs": "18.2",
                "batting": [
                    {"name": "Rohit Sharma", "status": "c Shaheen b Naseem", "runs": 32, "balls": 20, "fours": 3, "sixes": 2, "sr": 160.00},
                    {"name": "Virat Kohli", "status": "c Rizwan b Amir", "runs": 45, "balls": 38, "fours": 4, "sixes": 1, "sr": 118.42},
                    {"name": "Suryakumar Yadav", "status": "not out", "runs": 58, "balls": 32, "fours": 5, "sixes": 3, "sr": 181.25},
                    {"name": "Rishabh Pant", "status": "c Shadab b Haris Rauf", "runs": 12, "balls": 10, "fours": 1, "sixes": 0, "sr": 120.00},
                    {"name": "Hardik Pandya", "status": "not out", "runs": 4, "balls": 3, "fours": 0, "sixes": 0, "sr": 133.33}
                ],
                "bowling": [
                    {"name": "Shaheen Afridi", "overs": "3.2", "maidens": 0, "runs": 28, "wickets": 1, "economy": 8.40},
                    {"name": "Naseem Shah", "overs": "4.0", "maidens": 0, "runs": 31, "wickets": 2, "economy": 7.75},
                    {"name": "Mohammad Amir", "overs": "4.0", "maidens": 1, "runs": 22, "wickets": 2, "economy": 5.50},
                    {"name": "Imad Wasim", "overs": "3.0", "maidens": 0, "runs": 35, "wickets": 0, "economy": 11.67},
                    {"name": "Haris Rauf", "overs": "4.0", "maidens": 0, "runs": 38, "wickets": 1, "economy": 9.50}
                ]
            },
            "innings_2": {
                "team": "Pakistan",
                "score": "0",
                "wickets": "0",
                "overs": "0.0",
                "batting": [],
                "bowling": []
            }
        },
        "charts_data": {
            "worm_graph": [
                {"over": 1, "team_a_runs": 8, "team_b_runs": 0},
                {"over": 3, "team_a_runs": 24, "team_b_runs": 0},
                {"over": 6, "team_a_runs": 48, "team_b_runs": 0},
                {"over": 10, "team_a_runs": 82, "team_b_runs": 0},
                {"over": 15, "team_a_runs": 120, "team_b_runs": 0},
                {"over": 18, "team_a_runs": 150, "team_b_runs": 0}
            ],
            "partnership": [
                {"players": "S. Yadav & H. Pandya", "runs": 22, "balls": 11, "team": "India"},
                {"players": "V. Kohli & S. Yadav", "runs": 65, "balls": 48, "team": "India"}
            ],
            "live_meta": {
                "overs": "18.2",
                "run_rate": "8.39",
                "projected_score_8": "172",
                "projected_score_10": "178",
                "recent_balls": ["1", "4", "6", "W", "1", "2L"]
            }
        },
        "turning_points": [
            "Shaheen Afridi bowling a tight opening over giving away only 3 runs.",
            "Suryakumar Yadav reaching a quickfire 50 off 28 balls to resurrect India's innings in the middle overs."
        ],
        "momentum_data": [
            {"over": 3, "intensity": 45},
            {"over": 6, "intensity": 70},
            {"over": 10, "intensity": 20},
            {"over": 12, "intensity": -30},
            {"over": 15, "intensity": 60},
            {"over": 18, "intensity": 85}
        ],
        "predictions": {
            "win_probability": {"India": 62.0, "Pakistan": 38.0},
            "projected_score": "174",
            "ai_insights": "Suryakumar Yadav's current partnership with Hardik Pandya is scoring at 12 runs per over. Predictions expect India to finish at around 174 runs, giving their bowling unit a 62% win probability given the Kensington Oval's historical second-innings slow down."
        }
    }

    db.add(Match(**completed_match_card))
    db.add(Match(**live_match_card))

    db.commit()
    logger.info("Database seeding completed.")

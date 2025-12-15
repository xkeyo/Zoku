"""
Migration: Add list_name column to watchlists table
Run this to update existing database
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def migrate():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # Add list_name column with default value
        try:
            conn.execute(text("""
                ALTER TABLE watchlists 
                ADD COLUMN IF NOT EXISTS list_name VARCHAR(100) 
                DEFAULT 'My Watchlist' NOT NULL
            """))
            conn.commit()
            print("✓ Added list_name column")
        except Exception as e:
            print(f"Column might already exist: {e}")
        
        # Drop old unique constraint
        try:
            conn.execute(text("""
                ALTER TABLE watchlists 
                DROP CONSTRAINT IF EXISTS unique_user_stock
            """))
            conn.commit()
            print("✓ Dropped old unique constraint")
        except Exception as e:
            print(f"Constraint might not exist: {e}")
        
        # Add new unique constraint
        try:
            conn.execute(text("""
                ALTER TABLE watchlists 
                ADD CONSTRAINT unique_user_list_stock 
                UNIQUE (user_id, list_name, symbol)
            """))
            conn.commit()
            print("✓ Added new unique constraint")
        except Exception as e:
            print(f"Constraint might already exist: {e}")
        
        # Add index on list_name
        try:
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_watchlists_list_name 
                ON watchlists(list_name)
            """))
            conn.commit()
            print("✓ Added index on list_name")
        except Exception as e:
            print(f"Index might already exist: {e}")
    
    print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    migrate()

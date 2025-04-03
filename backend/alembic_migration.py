# alembic_migration.py
"""
Run this script to generate a migration adding the size column to the PDFs table.

Usage: python alembic_migration.py
"""

import os
import sys
import subprocess

def run_alembic_migration():
    # Generate migration
    subprocess.run(["alembic", "revision", "--autogenerate", "-m", "Add size column to PDF model"])
    
    # Run migration
    subprocess.run(["alembic", "upgrade", "head"])
    
    print("Migration complete. Now run the update_pdf_sizes.py script to populate sizes for existing PDFs.")

if __name__ == "__main__":
    run_alembic_migration()
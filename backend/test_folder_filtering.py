# test_folder_filtering.py
import requests
import json
from pprint import pprint

BASE_URL = httplocalhost8000api

def test_folder_filtering()
    # Get all folders
    print(Getting all folders...)
    response = requests.get(f{BASE_URL}folders)
    folders_data = response.json()
    folders = folders_data[folders]
    print(fFound {len(folders)} folders)
    for folder in folders
        print(f  Folder ID {folder['id']}, Name {folder['name']}, PDF Count {folder['pdf_count']})
    
    print(nGetting all PDFs...)
    response = requests.get(f{BASE_URL}pdfs)
    all_pdfs = response.json()
    print(fTotal PDFs {len(all_pdfs)})
    
    print(nTesting folder filtering...)
    
    # Test unfiled PDFs
    print(nUnfiled PDFs)
    response = requests.get(f{BASE_URL}pdfsfolder_id=-1)
    unfiled_pdfs = response.json()
    print(fUnfiled PDFs count {len(unfiled_pdfs)})
    for pdf in unfiled_pdfs[3]  # Show first 3
        print(f  PDF ID {pdf['id']}, Name {pdf['filename']}, Folder ID {pdf['folder_id']})
    
    # Test each folder
    for folder in folders
        folder_id = folder[id]
        folder_name = folder[name]
        
        print(fnPDFs in folder '{folder_name}' (ID {folder_id}))
        response = requests.get(f{BASE_URL}pdfsfolder_id={folder_id})
        folder_pdfs = response.json()
        print(fCount {len(folder_pdfs)})
        
        for pdf in folder_pdfs[3]  # Show first 3
            print(f  PDF ID {pdf['id']}, Name {pdf['filename']}, Folder ID {pdf['folder_id']})
    
    # Check for PDFs appearing in multiple folders
    print(nChecking for PDFs in multiple folders...)
    pdf_locations = {}
    
    # Check unfiled
    for pdf in unfiled_pdfs
        pdf_id = pdf[id]
        if pdf_id not in pdf_locations
            pdf_locations[pdf_id] = []
        pdf_locations[pdf_id].append(Unfiled)
    
    # Check each folder
    for folder in folders
        folder_id = folder[id]
        folder_name = folder[name]
        
        response = requests.get(f{BASE_URL}pdfsfolder_id={folder_id})
        folder_pdfs = response.json()
        
        for pdf in folder_pdfs
            pdf_id = pdf[id]
            if pdf_id not in pdf_locations
                pdf_locations[pdf_id] = []
            pdf_locations[pdf_id].append(folder_name)
    
    # Find PDFs in multiple locations
    duplicates = {pdf_id locations for pdf_id, locations in pdf_locations.items() if len(locations)  1}
    
    if duplicates
        print(nPDFs appearing in multiple folders)
        for pdf_id, locations in duplicates.items()
            print(f  PDF ID {pdf_id} appears in {', '.join(locations)})
    else
        print(nNo PDFs appear in multiple folders - filtering is working correctly!)

def check_database_data()
    print(nChecking database data directly...)
    response = requests.get(f{BASE_URL}pdfs)
    all_pdfs = response.json()
    
    print(PDF records from database)
    for pdf in all_pdfs
        print(f  ID {pdf['id']}, Filename {pdf['filename']}, Folder ID {pdf['folder_id']}, Folder Name {pdf['folder_name'] or 'None'})

if __name__ == __main__
    test_folder_filtering()
    check_database_data()
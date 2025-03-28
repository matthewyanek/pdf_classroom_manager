# debug_modules.py
import os
import sys

def check_directory(path):
    if os.path.exists(path) and os.path.isdir(path):
        print(f"✅ Directory exists: {path}")
        files = os.listdir(path)
        print(f"   Files: {files}")
        return True
    else:
        print(f"❌ Directory missing: {path}")
        return False

def check_file(path):
    if os.path.exists(path) and os.path.isfile(path):
        print(f"✅ File exists: {path}")
        return True
    else:
        print(f"❌ File missing: {path}")
        return False

# Check app directory
app_dir = "app"
if check_directory(app_dir):
    # Check models directory
    models_dir = os.path.join(app_dir, "models")
    if check_directory(models_dir):
        # Check specific model files
        check_file(os.path.join(models_dir, "__init__.py"))
        check_file(os.path.join(models_dir, "folder.py"))
        check_file(os.path.join(models_dir, "pdf.py"))
        check_file(os.path.join(models_dir, "tag.py"))

# Try importing
try:
    import app
    print("✅ Successfully imported app")
    
    try:
        import app.models
        print("✅ Successfully imported app.models")
        print(f"app.models file: {app.models.__file__}")
        
        try:
            from app.models import Folder
            print("✅ Successfully imported Folder from app.models")
        except ImportError as e:
            print(f"❌ Failed to import Folder from app.models: {e}")
            
    except ImportError as e:
        print(f"❌ Failed to import app.models: {e}")
        
except ImportError as e:
    print(f"❌ Failed to import app: {e}")

# Check Python path
print("\nPython path:")
for path in sys.path:
    print(f"  {path}")
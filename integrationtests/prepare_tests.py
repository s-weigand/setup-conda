import sys
import json


def write_initial_settings():
    """Write initial settings to a file"""
    initial_settings = {
        "executable": sys.executable,
        "version_info": str(sys.version_info),
    }
    with open("initial_settings.json", "w") as f:
        json.dump(initial_settings, f)
    print(json.dumps(initial_settings, indent=2))


def read_initial_settings():
    """Read initial settings to a file"""
    with open("initial_settings.json") as f:
        return json.load(f)


if __name__ == "__main__":
    write_initial_settings()

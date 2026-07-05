#!/usr/bin/env python3
"""Auto-add missing lucide-react icon imports to TypeScript files."""
import re
import sys
from pathlib import Path

# Comprehensive list of lucide-react icons that are commonly missing
KNOWN_ICONS = {
    'ShoppingCart', 'CreditCard', 'Plus', 'Snowflake', 'Eye', 'EyeOff', 'Shield', 'Sparkles',
    'Smartphone', 'Globe', 'Trash2', 'Copy', 'Bot', 'TrendingUp', 'TrendingDown',
    'AlertTriangle', 'Zap', 'Building2', 'ChevronRight', 'ChevronLeft', 'ChevronDown', 'ChevronUp',
    'Check', 'X', 'BarChart3', 'Clock', 'ArrowUpRight', 'ArrowDownRight', 'Download', 'ArrowRight',
    'ArrowLeft', 'ArrowUp', 'ArrowDown', 'MapPin', 'Coffee', 'Utensils', 'Fuel', 'Music', 'Tv',
    'Bell', 'Car', 'GraduationCap', 'Home', 'Phone', 'Target', 'PiggyBank', 'Star', 'Briefcase',
    'Crown', 'FileText', 'User', 'Users', 'ShieldCheck', 'Heart', 'Wallet', 'Receipt', 'Send',
    'ArrowRight', 'ArrowLeft', 'Filter', 'Image', 'MessageSquare', 'Settings', 'Camera', 'Upload',
    'Layers', 'Building', 'Landmark', 'PieChart', 'LineChart', 'Hash', 'Calendar', 'Lock', 'Key',
    'Map', 'Compass', 'Flag', 'Trophy', 'Award', 'Gift', 'Bookmark', 'Share2', 'ThumbsUp',
    'MessageCircle', 'HelpCircle', 'Info', 'MoreVertical', 'Search', 'Plus', 'Minus', 'Trash',
    'CheckCircle2', 'AlertCircle', 'ShieldCheck', 'Sparkles', 'ChevronRight', 'XCircle', 'Loader2',
    'Pencil', 'Trash', 'Save', 'XSquare', 'RotateCcw', 'RefreshCw', 'Power', 'LogIn', 'LogOut',
    'UserPlus', 'UserMinus', 'UserCheck', 'UserX', 'Settings', 'Sliders', 'SlidersHorizontal',
    'ToggleLeft', 'ToggleRight', 'Eye', 'EyeOff', 'Volume2', 'VolumeX', 'Bell', 'BellOff',
    'Mail', 'Inbox', 'Send', 'Reply', 'ReplyAll', 'Forward', 'Archive', 'Trash', 'Tag',
    'Bookmark', 'Flag', 'Calendar', 'Clock', 'Watch', 'Timer', 'Hourglass', 'Sun', 'Moon',
    'Cloud', 'CloudRain', 'CloudSnow', 'Wind', 'Droplet', 'Flame', 'Snowflake', 'Thermometer',
    'Umbrella', 'Cloud', 'CloudOff', 'Sun', 'Moon', 'Sunrise', 'Sunset', 'Wind', 'Rainbow',
    'Activity', 'BarChart', 'BarChart2', 'BarChart3', 'BarChart4', 'LineChart', 'PieChart',
    'TrendingUp', 'TrendingDown', 'DollarSign', 'Euro', 'PoundSterling', 'Bitcoin', 'CreditCard',
    'Wallet', 'Receipt', 'Banknote', 'Coins', 'PiggyBank', 'Briefcase', 'Building', 'Landmark',
    'Calculator', 'Package', 'Tag', 'Tags', 'Box', 'Gift', 'ShoppingBag', 'ShoppingBasket',
    'ShoppingCart', 'Truck', 'Plane', 'Ship', 'Train', 'Bus', 'Bike', 'Car', 'Taxi',
}

def find_missing_icons(content):
    """Find icons used but not imported from lucide-react."""
    # Find the lucide-react import block
    import_pattern = re.compile(
        r"import\s*\{([^}]+)\}\s*from\s*['\"]lucide-react['\"]",
        re.MULTILINE | re.DOTALL
    )
    m = import_pattern.search(content)
    if not m:
        return [], None
    imported = set()
    for name in m.group(1).split(','):
        name = name.strip()
        if name:
            # Handle "type Foo as Bar" or "Foo as Bar"
            base = name.split(' as ')[0].strip()
            imported.add(base)
    return list(imported), m

def find_used_icons(content):
    """Find all PascalCase identifiers that match KNOWN_ICONS."""
    used = set()
    for m in re.finditer(r'\b([A-Z][a-zA-Z0-9]+)\b', content):
        name = m.group(1)
        if name in KNOWN_ICONS:
            used.add(name)
    return used

def fix_file(path):
    p = Path(path)
    content = p.read_text()
    imported, m = find_missing_icons(content)
    if m is None:
        return False
    used = find_used_icons(content)
    missing = sorted(used - set(imported))
    if not missing:
        return False
    # Add to import block
    new_imports = imported + missing
    # Sort alphabetically for cleanliness
    new_imports = sorted(set(new_imports))
    new_block = "import {\n  " + ',\n  '.join(new_imports) + "\n} from 'lucide-react';"
    content = content[:m.start()] + new_block + content[m.end():]
    p.write_text(content)
    return missing

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: fix-imports.py <file_or_dir>...')
        sys.exit(1)
    for target in sys.argv[1:]:
        p = Path(target)
        files = list(p.rglob('*.tsx')) if p.is_dir() else [p]
        for f in files:
            if 'node_modules' in f.parts or 'dist' in f.parts:
                continue
            added = fix_file(f)
            if added:
                print(f'  {f}: added {len(added)} icons')

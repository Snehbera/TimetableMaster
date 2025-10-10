from django import template

register = template.Library()

@register.filter
def get_item(list_data, index):
    """Allows accessing a list item by its index in the template."""
    try:
        return list_data[index]
    except (IndexError, TypeError):
        return None

@register.filter(name='get_day')
def get_day(list_of_days, day_name):
    """Return the day dictionary from a list of days by its name."""
    for day in list_of_days:
        if day.get('name') == day_name:
            return day
    return {'is_offday': True, 'slots': []}

@register.filter(name='prev_item')
def prev_item(list_of_slots, index):
    """Return the previous item in a list, or None if index is 0."""
    try:
        if index > 0:
            return list_of_slots[index - 1]
    except (TypeError, IndexError):
        pass
    return None

@register.filter(name='get_item')
def get_item(data, key):
    """
    Allows accessing an item from a list by its index, or a value 
    from a dictionary by its key in the template.
    """
    if isinstance(data, dict):
        return data.get(key)
    
    # Check for list-like structures
    if isinstance(data, (list, tuple)):
        try:
            return data[key]
        except (IndexError, TypeError):
            # Handles out-of-bounds index or non-integer key for lists
            return None
            
    return None

@register.filter(name='get_day')
def get_day(list_of_days, day_name):
    """Return the day dictionary from a list of days by its name."""
    if not list_of_days:
        return {'is_offday': True, 'slots': []}

    for day in list_of_days:
        if day and day.get('name') == day_name:
            return day
            
    # Return a default off-day structure if no matching day is found
    return {'is_offday': True, 'slots': []}

@register.filter(name='get_attribute')
def get_attribute(obj, attr_name):
    """Safely gets an attribute from an object."""
    return getattr(obj, attr_name, None)
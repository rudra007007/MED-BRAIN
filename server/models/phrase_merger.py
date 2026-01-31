def merge_adjacent_entities(entities):
    """Merge adjacent NER tokens into phrases."""
    merged = []
    current = None

    for e in entities:
        if current is None:
            current = e
            continue

        # if tokens are adjacent
        if e["start"] == current["end"] + 1:
            current["word"] += " " + e["word"]
            current["end"] = e["end"]
            current["score"] = max(current["score"], e["score"])
        else:
            merged.append(current)
            current = e

    if current:
        merged.append(current)

    return merged

BOLD = "\\begin_layout Standard\n\n\\series bold"
DEFAULT = "\\series default"
COLOR_INHERIT = "\n\\color inherit\n"


def main(path: str, color: str, from_line: int, to_line: int) -> None:
    """
    This function reads a LyX file and colors the text in the specified color starting from the specified line.
    :param path: the path to the LyX file.
    :param color: the color to be used.
    :param from_line: the line from which the coloring should start.
    :param to_line: the line at which the coloring should stop.
    """
    COLOR = f"\n\\color {color}"

    lines = open(path, 'r', encoding='utf-8').readlines()
    res = "".join(lines[:from_line])
    text = "".join(lines[from_line:to_line:])
    end = "".join(lines[to_line:])

    while (i := text.find(BOLD)) != -1:
        res += text[:i] + BOLD + COLOR
        text = text[i + len(BOLD):]
        i = text.find(DEFAULT)
        res += text[:i] + DEFAULT + COLOR_INHERIT
        text = text[i + len(DEFAULT):]

    res += text + end
    open(path, 'w', encoding='utf-8').write(res)


if __name__ == "__main__":
    path = 'calculus_4_lbl.lyx'
    color = 'teal'
    from_line = 10281
    to_line = 11306

    main(path, color, from_line, to_line)

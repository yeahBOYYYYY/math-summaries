from enum import StrEnum


BOLD = "\\begin_layout Standard\n\n\\series bold"
DEFAULT = "\\series default"
COLOR_INHERIT = "\n\\color inherit\n"
SEPARATOR = "\\begin_inset Separator plain"


class Color(StrEnum):
    BLACK = "black"
    BLUE = "blue"
    RED = "red"
    GREEN = "green"
    MAGENTA = "magenta"
    PURPLE = "purple"
    BROWN = "brown"
    ORANGE = "orange"
    TEAL = "teal"
    # PINK = "pink"
    # CYAN = "cyan"
    # OLIVE = "olive"

    def next(self):
        cls = self.__class__
        members = list(cls)
        index = members.index(self) + 1
        if index >= len(members):
            index = 0
        return members[index]


def colorAbsolute(path: str, color: str, from_line: int, to_line: int) -> None:
    """
    This function reads a LyX file and colors the text in the specified color starting from the specified line to the specified line.
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

def colorChanges(path: str, from_color: Color = Color.BLACK, from_line: int = 0, to_line: int = None) -> None:
    """
    This function reads a LyX file and colors the text from the from_color and changes color evrytime it hits a seperator with COLORS list, starting from the specified line to the specified line.
    :param path: the path to the LyX file.
    :param from_color: the first color to be used.
    :param from_line: the line from which the coloring should start.
    :param to_line: the line at which the coloring should stop.
    """
    lines = open(path, 'r', encoding='utf-8').readlines()
    res = "".join(lines[:from_line])
    if to_line is None:
        to_line = len(lines)

    text = "".join(lines[from_line:to_line:])
    end = "".join(lines[to_line:])

    COLOR_str = f"\n\\color {from_color.value}"

    j = 0
    while (i := text.find(BOLD)) != -1:
        if (k := text[j:i].find(SEPARATOR)) != -1:
            from_color = from_color.next()
            COLOR_str = f"\n\\color {from_color.value}"
        res += text[:i] + BOLD + COLOR_str
        text = text[i + len(BOLD):]
        i = text.find(DEFAULT)
        res += text[:i] + DEFAULT + COLOR_INHERIT
        text = text[i + len(DEFAULT):]

    res += text + end
    open(path, 'w', encoding='utf-8').write(res)


if __name__ == "__main__":
    # path = 'calculus_4_lbl.lyx'
    # color = 'teal'
    # from_line = 10281
    # to_line = 11306

    # colorAbsolute(path, color, from_line, to_line)

    absulote_path = r"E:\University\!Summaries\lbl\\"
    # absulote_path = r"C:\Users\user\OneDrive\Documents\summaries\lbl\\"
    # absulote_path = r"./lbl/"

    path = "set_theory_lbl.lyx"
    colorChanges(absulote_path + path)

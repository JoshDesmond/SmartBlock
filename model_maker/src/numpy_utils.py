import numpy


def full_print_numpy_array(array: numpy.ndarray) -> None:
    """
    Fully prints the contents of a 2d or 1d numpy array

    Args:
        array (numpy.ndarray): The array to print

    """
    with numpy.printoptions(threshold=numpy.inf):
        print(array)


def different_signs(a: float, b: float) -> bool:
    """
    Returns true if a and b are different signs
    Args:
        a: float
        b: float
    """
    if a > 0:
        return b < 0
    elif a < 0:
        return b > 0
    elif a == 0:
        print("Note: a == 0")
        return True

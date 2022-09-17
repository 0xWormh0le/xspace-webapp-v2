from __future__ import division

import matplotlib.pyplot as plt
import numpy as np
import os
from collections import OrderedDict
import io
import PIL.Image as Image

import colour
from colour.plotting import *

from colour_checker_detection import (
    detect_colour_checkers_segmentation)


class color_correct():

    def __init__(self):
        self.SWATCHES = None
        self.REFERENCE_SWATCHES = None

    def create_color_matrix(self, path, show_output=False):
        """
        create a color matrix based off of a color card shot. Pass in the path to the color card shot you want to
        create a matrix for. This matrix can be applied to other photos by passing the photos into the other function
         in this class 'apply_color_correction'
        :param path:
        :param show_output:
        """
        colour_style()

        COLOUR_CHECKER_IMAGE_PATHS = path

        COLOUR_CHECKER_IMAGE = colour.cctf_decoding(colour.io.read_image(path))

        # print(COLOUR_CHECKER_IMAGE_PATHS, COLOUR_CHECKER_IMAGES)
        figure, axes, plt = plot_image(colour.cctf_encoding(COLOUR_CHECKER_IMAGE))
        if show_output:
            plt.show()
            figure.savefig('original.png')

        self.SWATCHES = []

        for swatches, colour_checker, masks in detect_colour_checkers_segmentation(
                COLOUR_CHECKER_IMAGE, additional_data=True):
            self.SWATCHES.append(swatches)

            # Using the additional data to plot the colour checker and masks.
            masks_i = np.zeros(colour_checker.shape)
            for i, mask in enumerate(masks):
                masks_i[mask[0]:mask[1], mask[2]:mask[3], ...] = 1
            figure, axes, plt = plot_image(
                colour.cctf_encoding(
                    np.clip(colour_checker + masks_i * 0.25, 0, 1)))
            if show_output:
                plt.show()
                figure.savefig('identified_color_card.png')

        D65 = colour.ILLUMINANTS['CIE 1931 2 Degree Standard Observer']['D65']
        REFERENCE_COLOUR_CHECKER = colour.COLOURCHECKERS['ColorChecker 2005']

        self.REFERENCE_SWATCHES = colour.XYZ_to_RGB(
            colour.xyY_to_XYZ(list(REFERENCE_COLOUR_CHECKER.data.values())),
            REFERENCE_COLOUR_CHECKER.illuminant, D65,
            colour.RGB_COLOURSPACES['sRGB'].XYZ_to_RGB_matrix)

        swatches_xyY = colour.XYZ_to_xyY(colour.RGB_to_XYZ(
            self.SWATCHES[0], D65, D65, colour.RGB_COLOURSPACES['sRGB'].RGB_to_XYZ_matrix))

        colour_checker = colour.characterisation.ColourChecker(
            os.path.basename(COLOUR_CHECKER_IMAGE_PATHS),
            OrderedDict(zip(REFERENCE_COLOUR_CHECKER.data.keys(), swatches_xyY)),
            D65)

        plot_multi_colour_checkers(
            [REFERENCE_COLOUR_CHECKER, colour_checker])

        swatches_f = colour.colour_correction(self.SWATCHES[0], self.SWATCHES[0], self.REFERENCE_SWATCHES)
        swatches_f_xyY = colour.XYZ_to_xyY(colour.RGB_to_XYZ(
            swatches_f, D65, D65, colour.RGB_COLOURSPACES['sRGB'].RGB_to_XYZ_matrix))
        colour_checker = colour.characterisation.ColourChecker(
            '{0} - CC'.format(os.path.basename(COLOUR_CHECKER_IMAGE_PATHS)),
            OrderedDict(zip(REFERENCE_COLOUR_CHECKER.data.keys(), swatches_f_xyY)),
            D65)

        plot_multi_colour_checkers(
            [REFERENCE_COLOUR_CHECKER, colour_checker])

        figure, axes, plt = plot_image(colour.cctf_encoding(
            colour.colour_correction(
                COLOUR_CHECKER_IMAGE, self.SWATCHES[0], self.REFERENCE_SWATCHES)))

        if show_output:
            plt.show()
            figure.savefig('output.png')

    def buffer_plot_and_get(self, fig):
        buf = io.BytesIO()
        fig.savefig(buf)
        buf.seek(0)
        return Image.open(buf)

    def apply_color_correction(self, paths, show_output=False):
        if self.SWATCHES is None or self.REFERENCE_SWATCHES is None:
            print("create color matrix first")

        COLOUR_CHECKER_IMAGES = [
            colour.cctf_decoding(colour.io.read_image(path))
            for path in paths
        ]
        out = []
        for i in range(len(COLOUR_CHECKER_IMAGES)):

            figure, axes, plt = plot_image(colour.cctf_encoding(COLOUR_CHECKER_IMAGES[i]))
            if show_output:
                plt.show()
                figure.savefig('acc-original.png')

            figure, axes, plt = plot_image(colour.cctf_encoding(
                colour.colour_correction(
                    COLOUR_CHECKER_IMAGES[i], self.SWATCHES[0], self.REFERENCE_SWATCHES)))

            if show_output:
                plt.show()
                figure.savefig('acc-output.png')

            if len(COLOUR_CHECKER_IMAGES) == 1:
                return self.buffer_plot_and_get(figure)
            else:
                out.append(self.buffer_plot_and_get(figure))
        return out

# p = r'C:\Users\10dallasj\Downloads\x-rite colorchecker.jpg'
# otherImage = r'C:\Users\10dallasj\Downloads\x-rite colorchecker.jpg'
# cc = color_correct()
# cc.create_color_matrix(p, show_output=True)
# cc.apply_color_correction([otherImage], show_output=True)

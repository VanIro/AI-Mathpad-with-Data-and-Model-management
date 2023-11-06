import base64
import cv2

import numpy as np
import io
from munch import Munch

# For pix2tex
# import pix2tex
from pix2tex.cli import LatexOCR, get_model, in_model_path
from PIL import Image

def make_prediction(img_64):
    nparr = np.fromstring(base64.b64decode(img_64), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)

    black_mask = image[:,:,-1]>0
    image[black_mask] = [255,255,255,255]

    # image_dir = 'aiMathpad/images'
    # image_path = image_dir + '/hellohi.jpg'
    
    # if not os.path.exists(image_dir):
    #     os.mkdir(image_dir)

    # cv2.imwrite(image_path, image)
    # result = make_prediction('hellohi.jpg')

    # Implementing pix2tex    
    
    # image = Image.open(image_path)
    image = Image.fromarray(image)


     #Load Model
    import os
    checkpoint_path = os.path.join(os.getcwd(),"dl_models/weights3.pth")
    arguments = Munch({'config': 'settings/config.yaml', 'checkpoint': checkpoint_path, 'no_cuda': True, 'no_resize': False})
    # model = keras.models.load_model(checkpoint_path)
    model = LatexOCR(arguments=arguments)
    # Result
    result = model(image)

    return result

import base64
import io
def img_from_base64(img_64):
    nparr = np.fromstring(base64.b64decode(img_64), np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)

    black_mask = image[:,:,-1]>0
    image[black_mask] = [255,255,255,255]

    success, encoded_image = cv2.imencode('.jpg', image)
    return encoded_image


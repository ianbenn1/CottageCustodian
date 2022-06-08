import cv2
from datetime import datetime
import os
  
# initialize the camera
# If you have multiple camera connected with 
# current device, assign a value in cam_port 
# variable according to that
now = datetime.now()
dt_string = now.strftime("%Y-%m-%d-t%H-%M-%S")

cam_port = 0
cam = cv2.VideoCapture(cam_port)

# reading the input using the camera
result, image = cam.read()
  
# If image will detected without any error, 
# show result
if result:
  
    # showing result, it take frame name and image 
    # output
    cv2.imshow("FrameCapture", image)
  
    # saving image in local storage

    cv2.imwrite('{0}.png'.format(dt_string), image)
  
    # If keyboard interrupt occurs, destroy image 
    # window
    # cv2.waitKey(0)
    cv2.destroyWindow("FrameCapture")
  
# If captured image is corrupted, moving to else part
else:
    print("No image detected. Please! try again")
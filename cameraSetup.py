import cv2

camera = 0
breakout = True
while breakout:
    if (cv2.VideoCapture(camera).grab()) is True:
        camera = camera + 1
    else:
        cv2.destroyAllWindows()
        if(camera > 0):
            print('{"status": "success", "cameras": "' + format(camera) + '"}')
        else:
            print('{"status": "failure", "cameras": "' + format(camera) + '"}')
        breakout = False
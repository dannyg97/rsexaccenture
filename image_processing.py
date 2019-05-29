#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cv2, time, numpy as np

# Read in images
cap = cv2.VideoCapture(1)

# Find circles for the lights - Hough circle transformation
while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()
    output = frame.copy()
    #operations on the frame
    # colourspace rgb -> hsv
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
        #Hough Circle transformation - uses grayscale
    circles = cv2.HoughCircles(gray,cv2.HOUGH_GRADIENT,1,20,
                                       param1=50,param2=30,minRadius=100,maxRadius=1000)
                                       
    if circles is not None:
        print ("num circles found is", len(circles[0,:]))

# circles = np.uint16(np.around(circles))

        # Display the resulting frame
    cv2.imshow('frame',frame)
#cv2.imshow('circles', output)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    cv2.waitKey(5)


# Change colourspace (RGB -> HSV)

# Find colours for each circle

# Send to splunk



# When everything done, release the capture
cap.release()

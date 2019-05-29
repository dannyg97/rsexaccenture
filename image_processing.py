#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import cv2, time, numpy as np

# Read in images
cap = cv2.VideoCapture(1)

# Find circles for the lights - Hough circle transformation
while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()
    #operations on the frame
    
    # colourspace rgb -> hsv
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # define colour ranges
    lower_red = np.array([150,100,100], dtype=np.uint8)
    upper_red = np.array([200, 255, 255], dtype=np.uint8)
    
    lower_grn = np.array([36,0,150], dtype=np.uint8)
    upper_grn = np.array([70, 255, 175], dtype=np.uint8)
    
    mask1 = cv2.inRange(hsv, lower_red, upper_red)
    mask2 = cv2.inRange(hsv, lower_grn, upper_grn)

    #cv2.imshow('rgb',frame)
    cv2.imshow('red', mask1)
    #cv2.imshow('green', mask2)
    
    target = cv2.bitwise_or(mask1, mask2)
    #cv2.imshow('or', target)
    
    blur = cv2.blur(target, (20, 20))
    
    # read on bitwise
    circles = cv2.HoughCircles(blur,cv2.HOUGH_GRADIENT,1,100,
                               param1=50,param2=30,minRadius=30,maxRadius=100)
                            
    output = cv2.cvtColor(target, cv2.COLOR_GRAY2RGB)
    if circles is not None:
        print ("num circles found is", len(circles[0,:]))
        for i in circles[0,:]:
            # draw the outer circle
            cv2.circle(output,(i[0],i[1]),i[2],(0,255,0),2)
            # draw the center of the circle
            cv2.circle(output,(i[0],i[1]),2,(0,0,255),3)
                               # Display the resulting frame
    cv2.imshow('output- bit', output)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    cv2.waitKey(5)

# Change colourspace (RGB -> HSV)

# Find colours for each circle

# Send to splunk



# When everything done, release the capture
cap.release()

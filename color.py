#importing Modules

import cv2
import numpy as np

#Capturing Video through webcam.

cap = cv2.VideoCapture(0)

while(1):
        _, img = cap.read()

        #converting frame(img) from BGR (Blue-Green-Red) to HSV (hue-saturation-value)

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        #defining the range of red color
        red_lower = np.array([169, 100, 100], dtype=np.uint8)
        red_upper = np.array([189, 255, 255], dtype=np.uint8)

        #defining range of green
        green_lower = np.array([36, 25, 25], dtype=np.uint8)
        green_upper = np.array([70, 255,255], dtype=np.uint8)

        #finding the range red colour in the image
        red = cv2.inRange(hsv, red_lower, red_upper)

        #finding range green in image
        green = cv2.inRange(hsv, green_lower, green_upper)

        #Morphological transformation, Dilation -> finding red & green range colour in frame       
        kernal = np.ones((5 ,5), "uint8")

        blue1=cv2.dilate(red, kernal)
        blue2=cv2.dilate(green, kernal)

        resr=cv2.bitwise_and(img, img, mask = red)
        resg=cv2.bitwise_and(img, img, mask = green)
        target=cv2.bitwise_or(resr, resg)

        #Tracking Colour (RED) -> compare amount of red to blue as a reference
        (_,contours,hierarchy)=cv2.findContours(red,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
        
        for pic, contour in enumerate(contours):
                area = cv2.contourArea(contour)
                if(area>300):
                        
                        x,y,w,h = cv2.boundingRect(contour)     
                        img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),3)
                        
        #Tracking Colour (GREEN) -> compare amount of green to blue as a reference
        (_,contours,hierarchy)=cv2.findContours(green,cv2.RETR_TREE,cv2.CHAIN_APPROX_SIMPLE)
        
        for pic, contour in enumerate(contours):
                area = cv2.contourArea(contour)
                if(area>300):
                        
                        x,y,w,h = cv2.boundingRect(contour)     
                        img = cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),3)
        
        #Tracking circles
        #blur = cv2.blur(target, (25, 25))

        blur = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
        
        circles = cv2.HoughCircles(blur,cv2.HOUGH_GRADIENT,1,100,
                               param1=50,param2=30,minRadius=20,maxRadius=60)
        output = cv2.cvtColor(blur, cv2.COLOR_GRAY2RGB)
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
        

        #Tracks Red and Green Colour and draws a rectangle around it

        #cv2.imshow(img) shows normal video with red colour being tracked.
        cv2.imshow("Color Tracking",img)

        #cv2.flip mirrors the image -> can remove to see a regular output
        img = cv2.flip(img,1)

        #cv2.imshow(res) displays video stream in window with only red/green colour
        cv2.imshow("Red",resr)
        cv2.imshow("Green",resg)
        cv2.imshow("Target",target)
                               
        if cv2.waitKey(10) & 0xFF == 27:
                cap.release()
                cv2.destroyAllWindows()
                break

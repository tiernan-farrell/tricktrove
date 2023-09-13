"use client";
import { useEffect } from "react";

const VideoAutoPlay = () => {
  useEffect(() => {
    const videos = document.querySelectorAll("video"); // Select all video elements
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5, // Video should be at least 50% visible to start playing
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement; // Type assertion
          video.play(); // Play the video when it's in view
        } else {
          const video = entry.target as HTMLVideoElement; // Type assertion
          video.pause(); // Pause the video when it's not in view
        }
      });
    }, options);

    videos.forEach((video) => {
      observer.observe(video); // Start observing each video element
    });

    return () => {
      observer.disconnect(); // Clean up the observer when the component unmounts
    };
  }, []);

  return null; // This component doesn't render anything itself
};

export default VideoAutoPlay;

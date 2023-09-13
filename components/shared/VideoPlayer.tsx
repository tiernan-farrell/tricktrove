"use client"

import React from 'react'
import 'next-cloudinary/dist/cld-video-player.css';
import { CldVideoPlayer } from 'next-cloudinary';

interface VideoPlayerProps { 
    id: string
}

const VideoPlayer = ({id}: VideoPlayerProps) => {
  return (
        <CldVideoPlayer
            width="1920"
            height="1080"
            src={id}
            autoPlay='true'
            controls
            loop
        />
  )
}

export default VideoPlayer
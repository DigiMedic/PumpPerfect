"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

const DEFAULT_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string
}

export function SafeImage({ 
  src, 
  fallbackSrc = DEFAULT_PLACEHOLDER, 
  ...props 
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      {...props}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
} 
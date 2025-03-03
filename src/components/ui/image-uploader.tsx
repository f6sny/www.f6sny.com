"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'
import { Slider } from "@/components/ui/slider"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ImageUploaderProps {
  value: string | { url: string }
  onChange: (value: string) => void
  label?: string
  description?: string
}

export function ImageUploader({ value, onChange, label, description }: ImageUploaderProps) {
  const { token, user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string)
        setIsOpen(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Set canvas size to the cropped size
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'))
          return
        }
        resolve(blob)
      }, 'image/jpeg', 0.95)
    })
  }

  const uploadToStrapi = async (blob: Blob): Promise<string> => {
    if (!token || !user) {
      throw new Error('User not authenticated')
    }

    const formData = new FormData()
    formData.append('files', blob, `${user.documentId}-avatar.jpg`)
    formData.append('ref', 'plugin::users-permissions.user')
    formData.append('refId', user.id.toString())
    formData.append('field', 'avatar')

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data[0].url
  }

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      setIsUploading(true)
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const imageUrl = await uploadToStrapi(croppedBlob)
      
      onChange(imageUrl)
      setIsOpen(false)
      setImageSrc(null)
      
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      
      toast({
        title: "تم تحميل الصورة بنجاح",
        description: "تم تحميل الصورة الشخصية بنجاح",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "خطأ في تحميل الصورة",
        description: "حدث خطأ أثناء تحميل الصورة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول لحذف الصورة الشخصية",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      
      // Update the user profile to remove the avatar
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user profile')
      }

      onChange('')
      
      toast({
        title: "تم حذف الصورة",
        description: "تم حذف الصورة الشخصية بنجاح",
      })
    } catch (error) {
      console.error('Error deleting avatar:', error)
      toast({
        title: "خطأ في حذف الصورة",
        description: "حدث خطأ أثناء حذف الصورة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage 
            src={
              typeof value === 'object' && value.url 
                ? value.url 
                : (typeof value === 'string' && (value.startsWith('http') || value.startsWith('https')) 
                    ? value 
                    : `${process.env.NEXT_PUBLIC_API_URL}${typeof value === 'string' && value.startsWith('/') ? value : `/${value}`}`)
            }
            alt="Avatar"
          />
          <AvatarFallback>
            {user?.display_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <Input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden"
            id="avatar-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            disabled={isUploading}
          >
            تحميل صورة
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="mr-2"
              disabled={isUploading}
            >
              حذف
            </Button>
          )}
          {description && <p className="text-sm text-stone-500">{description}</p>}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => !isUploading && setIsOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تعديل الصورة</DialogTitle>
            <DialogDescription>
              قم بتحريك وتكبير الصورة لاختيار الجزء المناسب
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-[300px] w-full">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <div className="py-4">
            <Label>تكبير</Label>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsOpen(false)} variant="outline" disabled={isUploading}>
              إلغاء
            </Button>
            <Button type="button" onClick={handleSave} disabled={isUploading}>
              {isUploading ? "جاري التحميل..." : "حفظ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
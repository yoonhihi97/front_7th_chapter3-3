import { forwardRef } from "react"

type AvatarSize = "sm" | "md" | "lg" | "xl"

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize
  fallback?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-24 h-24",
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback, ...props }, ref) => {
    const sizeClass = sizeClasses[size]

    if (!src && fallback) {
      return (
        <div
          className={`${sizeClass} rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium ${className}`}
        >
          {fallback}
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        {...props}
      />
    )
  },
)
Avatar.displayName = "Avatar"

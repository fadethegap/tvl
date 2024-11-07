"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import {
  Heart,
  Eye,
  Users,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type {
  Resource,
  Platform,
  Category,
  Duration,
  Language,
  EditingStyle,
  Orientation,
} from "@prisma/client"

interface ResourceWithRelations extends Resource {
  platform: Platform
  category: Category
  duration: Duration
  language: Language
  editingStyle: EditingStyle
  orientation: Orientation
}

interface ResourceCardProps {
  resource: ResourceWithRelations
  onFavorite?: (id: number) => Promise<void>
  isFavorited?: boolean
  isToggling?: boolean // Changed from isLoading to be more specific
}

export function ResourceCard({
  resource,
  onFavorite,
  isFavorited = false,
  isToggling = false,
}: ResourceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!onFavorite || isToggling) return
    await onFavorite(resource.id)
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden">
        <a
          href={resource.contentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Video/Thumbnail Section */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            {/* Platform Badge */}
            <Badge variant="secondary" className="absolute top-2 left-2 z-10">
              {resource.platform.name}
            </Badge>

            {/* Favorite Button */}
            {onFavorite && (
              <Button
                size="sm"
                variant="ghost"
                className={`absolute top-2 right-2 z-10 ${
                  isFavorited ? "text-red-500" : "text-white"
                }`}
                onClick={handleFavorite}
                disabled={isToggling}
              >
                {isToggling ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart
                    className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`}
                  />
                )}
              </Button>
            )}
          </div>

          <CardContent className="p-4">
            {/* Title & Creator */}
            <h3 className="font-semibold mb-2 line-clamp-2">
              {resource.creatorName}
            </h3>

            {/* Stats Row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{resource.totalViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{resource.totalFollowers.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(resource.postingDate), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Tags/Categories */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{resource.category.name}</Badge>
              {resource.tags?.split(",").map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto group">
                    <ExternalLink className="h-4 w-4 transition-transform group-hover:scale-110" />
                    <span className="sr-only">Open link</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open in new tab</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </a>
      </Card>
    </motion.div>
  )
}

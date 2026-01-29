import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  User,
  Play,
  Image as ImageIcon,
  Video,
  Heart,
  Share2,
  Download,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  Star,
  Clock,
  Baby,
  GraduationCap,
  BookOpen,
  Palette
} from 'lucide-react';
import { getGallery } from '../api/photoGallery.js';
import { toast } from 'react-hot-toast';

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, []);

  // Auto-slideshow for recent activities
  useEffect(() => {
    if (gallery.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % gallery.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [gallery.length]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await getGallery();
      
      if (response.success) {
        setGallery(response.data.gallery || []);
        setEvents(response.data.event || []);
      }
    } catch {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = (photo, index) => {
    setPreviewPhoto(photo);
    setCurrentImageIndex(index);
    setShowPreviewModal(true);
  };

  const handleLike = (photoId) => {
    setLikedPhotos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
        toast.success('Removed from favorites');
      } else {
        newSet.add(photoId);
        toast.success('Added to favorites');
      }
      return newSet;
    });
  };

  const handleShare = async (photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: `Check out this precious moment from our preschool: ${photo.title}`,
          url: photo.Url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(photo.Url);
      toast.success('Photo URL copied to clipboard');
    }
  };

  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = photo.Url;
    link.download = photo.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const navigateImage = (direction) => {
    const allPhotos = [...gallery, ...events];
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % allPhotos.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    }
    setPreviewPhoto(allPhotos[currentImageIndex]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <motion.section 
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-gradient-to-br from-primary-light dark:from-primary-dark via-secondary-light dark:via-secondary-dark to-accent-light dark:to-accent-dark py-20 px-6 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <Baby size={20} className="text-white" />
            <span className="text-white font-medium">Little Stars Gallery</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Capturing
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Little Moments
            </span>
          </h1>
          
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Watch our little stars grow, learn, and play through precious moments captured in our preschool gallery.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="flex items-center gap-2 text-white">
              <Camera size={20} />
              <span className="font-medium">{gallery.length + events.length} Memories</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Calendar size={20} />
              <span className="font-medium">{events.length} Special Events</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Star size={20} />
              <span className="font-medium">Growing Together</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Activities Slideshow Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-4">
              Recent Activities
            </h2>
            <p className="text-lg text-text-secondaryLight dark:text-text-secondaryDark">
              Daily moments of learning, playing, and growing together
            </p>
          </motion.div>

          {loading ? (
            <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 animate-pulse">
              <div className="aspect-[16/9] bg-neutral-light dark:bg-neutral-dark rounded-2xl"></div>
            </div>
          ) : gallery.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-surface-light dark:bg-surface-dark rounded-3xl"
            >
              <BookOpen size={64} className="mx-auto text-neutral-light dark:text-neutral-dark mb-4" />
              <h3 className="text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
                No recent activities yet
              </h3>
              <p className="text-text-secondaryLight dark:text-text-secondaryDark">
                Check back soon for photos of our daily learning adventures!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-surface-light dark:bg-surface-dark rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Slideshow Container */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {gallery[currentSlide]?.mediaType === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={gallery[currentSlide].Url}
                          className="w-full h-full object-cover"
                          muted
                          autoPlay
                          loop
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <Play size={64} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={gallery[currentSlide].Url}
                        alt={gallery[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Slideshow Navigation */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
                
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % gallery.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-colors"
                >
                  <ChevronRight size={24} className="text-white" />
                </button>

                {/* Slideshow Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>

                {/* Photo Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {gallery[currentSlide]?.title}
                  </h3>
                  <div className="flex items-center gap-4 text-white text-sm">
                    <span className="flex items-center gap-1">
                      <User size={16} />
                      {gallery[currentSlide]?.postedBy?.name || 'Preschool Staff'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {new Date(gallery[currentSlide]?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 px-6 bg-surfaceAlt-light dark:bg-surfaceAlt-dark">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-text-primaryLight dark:text-text-primaryDark mb-4">
              Special Events & Festivals
            </h2>
            <p className="text-lg text-text-secondaryLight dark:text-text-secondaryDark">
              Celebrating milestones and creating magical memories together
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 animate-pulse">
                  <div className="aspect-square bg-neutral-light dark:bg-neutral-dark rounded-full mb-4"></div>
                  <div className="h-5 bg-neutral-light dark:bg-neutral-dark rounded mb-2"></div>
                  <div className="h-4 bg-neutral-light dark:bg-neutral-dark rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <GraduationCap size={64} className="mx-auto text-neutral-light dark:text-neutral-dark mb-4" />
              <h3 className="text-2xl font-semibold text-text-primaryLight dark:text-text-primaryDark mb-2">
                No events yet
              </h3>
              <p className="text-text-secondaryLight dark:text-text-secondaryDark">
                Stay tuned for upcoming celebrations and special moments!
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    variants={itemVariants}
                    layout
                    className="group bg-surface-light dark:bg-surface-dark rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      {event.mediaType === 'video' ? (
                        <div className="relative w-full h-full">
                          <video
                            src={event.Url}
                            className="w-full h-full object-cover"
                            muted
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <Play size={48} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={event.Url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onClick={() => handlePhotoClick(event, index)}
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePhotoClick(event, index)}
                              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                            >
                              <Eye size={16} className="text-gray-700" />
                            </button>
                            <button
                              onClick={() => handleLike(event._id)}
                              className={`p-2 rounded-full transition-colors ${
                                likedPhotos.has(event._id)
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700'
                              }`}
                            >
                              <Heart size={16} fill={likedPhotos.has(event._id) ? 'currentColor' : 'none'} />
                            </button>
                            <button
                              onClick={() => handleShare(event)}
                              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                            >
                              <Share2 size={16} className="text-gray-700" />
                            </button>
                            <button
                              onClick={() => handleDownload(event)}
                              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-colors"
                            >
                              <Download size={16} className="text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Media Type Badge */}
                      <div className="absolute top-4 right-4">
                        {event.mediaType === 'video' ? (
                          <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                            <Video size={12} />
                            <span>Video</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                            <ImageIcon size={12} />
                            <span>Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Event Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-secondary-light dark:bg-secondary-dark text-black text-xs rounded-full font-medium shadow-lg">
                          Special Event
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg text-text-primaryLight dark:text-text-primaryDark mb-3 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-text-secondaryLight dark:text-text-secondaryDark">
                        <div className="flex items-center gap-2">
                          <User size={14} />
                          <span>{event.postedBy?.name || 'Preschool Staff'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-colors"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30 transition-colors"
              >
                <ChevronRight size={24} className="text-white" />
              </button>

              {/* Media Content */}
              <div className="flex items-center justify-center h-full">
                {previewPhoto.mediaType === 'video' ? (
                  <video
                    src={previewPhoto.Url}
                    controls
                    className="w-full h-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <img
                    src={previewPhoto.Url}
                    alt={previewPhoto.title}
                    className="w-full h-full max-h-[80vh] object-contain rounded-lg"
                  />
                )}
              </div>

              {/* Photo Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm text-white p-6 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{previewPhoto.title}</h3>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="flex items-center gap-2">
                        <User size={16} />
                        {previewPhoto.postedBy?.name || 'Preschool Staff'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(previewPhoto.createdAt).toLocaleDateString()}
                      </span>
                      {previewPhoto.event && (
                        <span className="px-3 py-1 bg-secondary-light dark:bg-secondary-dark text-black rounded-full text-xs font-medium">
                          Special Event
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(previewPhoto._id)}
                      className={`p-3 rounded-full transition-colors ${
                        likedPhotos.has(previewPhoto._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                      }`}
                    >
                      <Heart size={20} fill={likedPhotos.has(previewPhoto._id) ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleShare(previewPhoto)}
                      className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors text-white"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDownload(previewPhoto)}
                      className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors text-white"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
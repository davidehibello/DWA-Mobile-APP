import React, { useState, useRef, useEffect } from 'react';
  // Add this import at the top of the file
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Animated, Modal, ActivityIndicator, Alert, Linking, Image } from 'react-native';
import { Svg, Circle, Text as SvgText, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { PanResponder } from 'react-native';
import { api } from '../services/api';

// Invenator (Greatness): List of sectors for filtering
const SECTORS = [
  'Apprenticeships', 
  'Construction', 
  'Manufacturing', 
  'Finance & Retail', 
  'Service', 
  'Agriculture', 
  'Tourism & Hospitality', 
  'Healthcare', 
  'Education & Social Services', 
  'Transportation', 
  'Information & Communications Technology'
];

// Invenator (Greatness): Define the trending threshold
const TRENDING_THRESHOLD = 15;

// Invenator (Greatness): Fallback mock data generator in case API fails
const generateMockCategories = () => {
  const categories = [
    { id: 1, name: 'Administrative', count: 12, sector: 'Service' },
    { id: 2, name: 'IT & Software', count: 27, sector: 'Information & Communications Technology' },
    { id: 3, name: 'Hospitality', count: 31, sector: 'Tourism & Hospitality' },
    { id: 4, name: 'Finance', count: 30, sector: 'Finance & Retail' },
    { id: 5, name: 'Manufacturing', count: 18, sector: 'Manufacturing' },
    { id: 6, name: 'Engineering', count: 22, sector: 'Manufacturing' },
    { id: 7, name: 'Healthcare', count: 20, sector: 'Healthcare' },
    { id: 8, name: 'Education', count: 16, sector: 'Education & Social Services' },
    { id: 9, name: 'Transportation', count: 14, sector: 'Transportation' },
    { id: 10, name: 'Construction', count: 25, sector: 'Construction' },
  ];

  // Invenator (Greatness): Add descriptions, skills, salary info, and median salary to each category
  return categories.map(category => {
    return {
      ...category,
      description: `${category.name} are professionals who work in the ${category.sector} sector. They provide specialized services and require specific skills for their roles.`,
      skills: ['Communication', 'Teamwork', 'Problem-solving', 'Attention to detail', 'Technical expertise'],
      salary: `$${Math.floor(Math.random() * 40000) + 30000} - $${Math.floor(Math.random() * 50000) + 60000}`,
      medianSalary: Math.floor(Math.random() * 60000) + 40000, // Random median salary for mock data
      isRelated: Math.random() > 0.7,  // Random related flag for demonstration
    };
  });
};

const CareerExplorer = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryJobs, setCategoryJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [bubbleSizeOption, setBubbleSizeOption] = useState('Equal');
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSectorSelector, setShowSectorSelector] = useState(false);
  const [detailsActive, setDetailsActive] = useState({
    description: false,
    skills: false,
    salary: false,
    jobs: false,
    codes: false,
  });
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  const [lastScale, setLastScale] = useState(1);
  
  // Invenator (Greatness): Position for each bubble
  const [bubblePositions, setBubblePositions] = useState([]);
  
  // Invenator (Greatness): Reference for SVG
  const svgRef = useRef(null);
  const panRef = useRef(new Animated.ValueXY()).current;

  // Invenator (Greatness): For pinch to zoom functionality
  const initDistance = useRef(0);
  const prevDistance = useRef(0);
  const isPinching = useRef(false);

  // Invenator (Greatness): Fetch job categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.jobs.getCategories();
      
      // Invenator (Greatness): Filter out categories with very low counts if needed
      const filteredData = data.filter(cat => cat.count > 0);
      
      setCategories(filteredData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching job categories:', err);
      setError('Failed to load job categories. Please try again.');
      // Invenator (Greatness): Fallback to mock data if API fails
      setCategories(generateMockCategories());
      setLoading(false);
    }
  };

  // Invenator (Greatness): Fetch jobs for a specific category
  const fetchCategoryJobs = async (categoryName) => {
    if (!categoryName) return;
    
    try {
      setJobsLoading(true);
      const data = await api.jobs.getCategoryDetail(categoryName);
      setCategoryJobs(data.jobs || []);
      setJobsLoading(false);
    } catch (err) {
      console.error('Error fetching category jobs:', err);
      setCategoryJobs([]);
      setJobsLoading(false);
    }
  };

  // Invenator (Greatness): Helper to smoothly update scale for better transitions
  const updateScaleWithAnimation = (newScale) => {
    // Invenator (Greatness): Simple direct state update - no animation needed
    setScale(newScale);
    setLastScale(newScale);
  };

  // Invenator (Greatness): Generate positions for bubbles that don't overlap
  useEffect(() => {
    setLoading(true);
    
    // Invenator (Greatness): Use setTimeout to prevent UI from freezing during calculation
    setTimeout(() => {
      const { width, height } = Dimensions.get('window');
      const centerX = width / 2;
      const centerY = height / 2.5;
      const positions = [];
      
      const filteredCategories = filterCategories();
      
      // Invenator (Greatness): Function to check if position overlaps with existing ones
      const doesOverlap = (x, y, radius, positions) => {
        for (const pos of positions) {
          const dist = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
          if (dist < radius + pos.radius + 5) { // 5px buffer
            return true;
          }
        }
        return false;
      };
      
      // Invenator (Greatness): Generate positions for each category bubble
      filteredCategories.forEach((category, i) => {
        // Invenator (Greatness): Determine radius based on bubble size option
        let radius;
        if (bubbleSizeOption === 'Job Openings') {
          radius = 30 + (category.count / 3); // Scale by job count
        } else if (bubbleSizeOption === 'Median Salary') {
          // Invenator (Greatness): Scale by median salary - normalize between 50-100
          const minSalary = 40000; // Minimum expected salary
          const maxSalary = 200000; // Maximum expected salary
          const normalizedSalary = Math.min(1, Math.max(0, (category.medianSalary - minSalary) / (maxSalary - minSalary)));
          radius = 50 + (normalizedSalary * 50); // Scale between 50-100
        } else {
          radius = 70; // Equal size for all
        }
        
        // Invenator (Greatness): Cap min/max size
        radius = Math.max(50, Math.min(radius, 100));
        
        // Invenator (Greatness): Try to find non-overlapping position
        let x, y;
        let attempts = 0;
        let placed = false;
        
        while (!placed && attempts < 100) {
          // Invenator (Greatness): Spiral placement pattern
          const angle = (i * 0.6) % (2 * Math.PI);
          const distance = 50 + (attempts * 15) + (i * 4);
          
          x = centerX + distance * Math.cos(angle);
          y = centerY + distance * Math.sin(angle);
          
          if (!doesOverlap(x, y, radius, positions)) {
            positions.push({ x, y, radius, category });
            placed = true;
          }
          
          attempts++;
        }
        
        // Invenator (Greatness): If we couldn't place it, just put it somewhere
        if (!placed) {
          x = centerX + Math.random() * width * 0.6 - width * 0.3;
          y = centerY + Math.random() * height * 0.6 - height * 0.3;
          positions.push({ x, y, radius, category });
        }
      });
      
      setBubblePositions(positions);
      setLoading(false);

      // Invenator (Greatness): Set initial scale to make bubbles more visible
      if (lastScale === 1 && scale === 1) {
        setScale(3);
        setLastScale(3);
      } 
    }, 100);
  }, [categories, searchKeyword, selectedSectors, bubbleSizeOption, showTrendingOnly]);

  // Invenator (Greatness): Calculate distance between two touch points
  const distance = (touches) => {
    if (touches.length < 2) return 0;
    
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Invenator (Greatness): Set up pan responder for dragging and zooming
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        panRef.setOffset({
          x: panRef.x._value,
          y: panRef.y._value,
        });
        panRef.setValue({ x: 0, y: 0 });
        
        // Invenator (Greatness): Initialize pinch gesture
        if (evt.nativeEvent.touches.length === 2) {
          const dist = distance(evt.nativeEvent.touches);
          initDistance.current = dist;
          isPinching.current = true;
        } else {
          isPinching.current = false;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // Invenator (Greatness): Handle pinch to zoom
        if (evt.nativeEvent.touches.length === 2) {
          const dist = distance(evt.nativeEvent.touches);
          
          if (initDistance.current === 0) {
            initDistance.current = dist;
            return;
          }
          
          // Invenator (Greatness): Calculate scaling factor by comparing with initial distance
          const scaleDelta = dist / initDistance.current;
          
          // Invenator (Greatness): Increase max zoom limit from 3 to 5
          const newScale = Math.max(0.5, Math.min(5, lastScale * scaleDelta));
          
          setScale(newScale);
        } 
        // Invenator (Greatness): Handle panning when not pinching
        else if (!isPinching.current) {
          panRef.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        }
      },
      onPanResponderRelease: () => {
        // Invenator (Greatness): Only update lastScale if we were actually pinching
        if (isPinching.current) {
          setLastScale(scale);
        }
        
        // Invenator (Greatness): Reset pinch state
        initDistance.current = 0;
        isPinching.current = false;
        
        panRef.flattenOffset();
      },
    })
  ).current;

  // Invenator (Greatness): Reference for tracking double taps
  const lastTapTimeRef = useRef(0);
  const doubleTapTimeout = useRef(null);

  // Invenator (Greatness): Function to handle double tap reset
  const handleDoubleTap = (event) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      // Invenator (Greatness): Clear pending single-tap actions
      clearTimeout(doubleTapTimeout.current);
      
      // Invenator (Greatness): Reset zoom and position directly without animation
      setScale(1.5); // Reset to default enlarged view, not 1
      setLastScale(1.5);
      panRef.setValue({ x: 0, y: 0 });
    } else {
      // Invenator (Greatness): Set up to detect second tap
      lastTapTimeRef.current = now;
      
      // Invenator (Greatness): Use timeout to separate single taps from double taps
      doubleTapTimeout.current = setTimeout(() => {
        // This was a single tap, no action needed
      }, DOUBLE_TAP_DELAY);
    }
  };

  // Invenator (Greatness): Filter categories based on search, sector filter, and trending status
  const filterCategories = () => {
    return categories.filter(category => {
      // Invenator (Greatness): Apply search filter
      const matchesSearch = searchKeyword === '' || 
        category.name.toLowerCase().includes(searchKeyword.toLowerCase());
      
      // Invenator (Greatness): Apply sector filter (multiple sectors)
      const matchesSector = selectedSectors.length === 0 || 
        selectedSectors.includes(category.sector);
      
      // Invenator (Greatness): Apply trending filter if enabled
      const matchesTrending = !showTrendingOnly || 
        category.count >= TRENDING_THRESHOLD;
      
      return matchesSearch && matchesSector && matchesTrending;
    });
  };

  // Invenator (Greatness): Handle category selection
  const handleCategorySelect = (category) => {
    if (category.id === selectedCategory?.id) {
      setSelectedCategory(null);
      setCategoryJobs([]);
    } else {
      setSelectedCategory(category);
      fetchCategoryJobs(category.name);
    }
  };

  // Invenator (Greatness): Toggle filter view
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Invenator (Greatness): Toggle sectors in multi-select
  const toggleSector = (sector) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      setSelectedSectors([...selectedSectors, sector]);
    }
  };

  // Invenator (Greatness): Toggle trending filter to show only in-demand job categories
  const toggleTrending = () => {
    setShowTrendingOnly(!showTrendingOnly);
  };

  // Invenator (Greatness): Set bubble size option
  const selectBubbleSize = (option) => {
    setBubbleSizeOption(option);
  };

  // Invenator (Greatness): Reset all filters
  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedSectors([]);
    setBubbleSizeOption('Equal');
    setShowTrendingOnly(false);
    setScale(1);
    setLastScale(1);
  };
  
  // Invenator (Greatness): Toggle detail sections
  const toggleDetailSection = (section) => {
    setDetailsActive({
      ...detailsActive,
      [section]: !detailsActive[section]
    });
  };

  // Invenator (Greatness): function to wrap text within the cluster "bubbles"
  const wrapText = (text, radius) => {
    if (!text) return [];
    
    // Invenator (Greatness): Calculate max chars per line based on radius
    // Approximate 6px per character for average font
    const maxCharsPerLine = Math.floor(radius / 4);
    
    // Invenator (Greatness): Don't wrap very short text
    if (text.length <= maxCharsPerLine) return [text];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      // Invenator (Greatness): Test if adding this word exceeds the max line length
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (testLine.length <= maxCharsPerLine) {
        currentLine = testLine;
      } else {
        // Invenator (Greatness): If currentLine is not empty, push it and start a new line
        if (currentLine) {
          lines.push(currentLine);
        }
        // Invenator (Greatness): If the word itself is too long, truncate it
        if (word.length > maxCharsPerLine) {
          currentLine = word.substring(0, maxCharsPerLine-3) + '...';
        } else {
          currentLine = word;
        }
      }
    });
    
    // Invenator (Greatness): Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Invenator (Greatness): Limit to 3 lines maximum
    if (lines.length > 3) {
      lines.splice(3);
      const lastLine = lines[2];
      if (lastLine.length > maxCharsPerLine - 3) {
        lines[2] = lastLine.substring(0, maxCharsPerLine - 3) + '...';
      } else {
        lines[2] = lastLine + '...';
      }
    }
    
    return lines;
  };

  // Invenator (Greatness): Format date for job cards
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Invenator (Greatness): Handle job click to open URL
  const handleJobClick = (url) => {
    if (!url) return;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open this URL');
        }
      })
      .catch(err => console.error('Error opening URL:', err));
  };

  // Invenator (Greatness): Render job card for the category detail section
  const renderJobCard = (job) => {
    const jobType = job.type === 'PT' ? 'Part Time' : 'Full Time';
    const location = job.location || 'Location not specified';
    const formattedDate = formatDate(job.postDate);
    
    return (
      <TouchableOpacity 
        key={job.id} 
        style={styles.jobCard}
        onPress={() => handleJobClick(job.url)}
      >
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobCompany}>{job.employer}</Text>
        <Text style={styles.jobDetails}>
          {formattedDate} · {location} · {jobType}
        </Text>
      </TouchableOpacity>
    );
  };

  // Removed SectorSelector component as it's no longer needed with the in-modal multi-select approach

  // Invenator (Greatness): Error component for when data fetching fails
  const ErrorView = ({ message, onRetry }) => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Invenator (Greatness): Top row with back button, title and logo */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#213E64" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Career Explorer</Text>
          <Image source={require("./DWA-logo.png")} style={styles.logo} />
        </View>
        
        {/* Invenator (Greatness): Search and Filter row */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={16} color="#666" style={styles.searchIcon} />
            <TextInput
              placeholder="Search by Keyword..."
              style={styles.searchInput}
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              placeholderTextColor="#666"
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilters}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.filterText}>Filters</Text>
              <Ionicons name="funnel" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, showTrendingOnly && styles.activeFilterButton]}
            onPress={toggleTrending}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.filterText}>Trending</Text>
              <Ionicons name="trending-up" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Invenator (Greatness): Filters Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleFilters}
      >
        <TouchableOpacity 
          style={styles.modalContainer} 
          activeOpacity={1} 
          onPress={toggleFilters}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()} // Prevent closing when tapping on the content
          >
            <View style={styles.modalHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <TouchableOpacity onPress={toggleFilters}>
                <Ionicons name="close" size={24} color="#213E64" />
              </TouchableOpacity>
            </View>

            {/* Invenator (Greatness): Sector Filter Section - multi-select checkboxes */}
            <Text style={styles.filterLabel}>FILTER BY SECTOR</Text>
            <ScrollView style={styles.sectorScrollView}>
              <TouchableOpacity
                style={styles.sectorOption}
                onPress={() => setSelectedSectors([])}
              >
                <Text style={styles.sectorText}>Show All Sectors</Text>
                {selectedSectors.length === 0 && (
                  <Ionicons name="checkmark" size={18} color="#649A47" />
                )}
              </TouchableOpacity>
              
              {SECTORS.map((sector) => (
                <TouchableOpacity
                  key={sector}
                  style={[
                    styles.sectorOption,
                    selectedSectors.includes(sector) && styles.selectedSectorOption
                  ]}
                  onPress={() => toggleSector(sector)}
                >
                  <Text style={styles.sectorText}>{sector}</Text>
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      selectedSectors.includes(sector) && styles.checkboxSelected
                    ]}>
                      {selectedSectors.includes(sector) && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Invenator (Greatness): Bubble Size Options Section - redesigned as a list */}
            <Text style={styles.filterLabel}>BUBBLE SIZE OPTIONS</Text>
            <View style={styles.bubbleSizeOptions}>
              <TouchableOpacity
                style={[
                  styles.bubbleSizeOption,
                  bubbleSizeOption === 'Equal' && styles.selectedBubbleSizeOption
                ]}
                onPress={() => selectBubbleSize('Equal')}
              >
                <Text style={styles.bubbleSizeText}>Equal Size</Text>
                {bubbleSizeOption === 'Equal' && (
                  <Ionicons name="checkmark" size={18} color="#649A47" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.bubbleSizeOption,
                  bubbleSizeOption === 'Job Openings' && styles.selectedBubbleSizeOption
                ]}
                onPress={() => selectBubbleSize('Job Openings')}
              >
                <Text style={styles.bubbleSizeText}>Size by Job Openings</Text>
                {bubbleSizeOption === 'Job Openings' && (
                  <Ionicons name="checkmark" size={18} color="#649A47" />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.bubbleSizeOption,
                  bubbleSizeOption === 'Median Salary' && styles.selectedBubbleSizeOption
                ]}
                onPress={() => selectBubbleSize('Median Salary')}
              >
                <Text style={styles.bubbleSizeText}>Size by Median Salary</Text>
                {bubbleSizeOption === 'Median Salary' && (
                  <Ionicons name="checkmark" size={18} color="#649A47" />
                )}
              </TouchableOpacity>
            </View>

            {/* Invenator (Greatness): Button Row */}
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={toggleFilters}
              >
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => {
                  resetFilters();
                  toggleFilters();
                }}
              >
                <Text style={styles.buttonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* No longer needed with the new multi-select approach */}

      {/* Invenator (Greatness): Main Content Area */}
      {error ? (
        <ErrorView message={error} onRetry={fetchCategories} />
      ) : (
        <View 
          style={styles.explorerContainer}
          {...panResponder.panHandlers}
          onTouchEnd={handleDoubleTap}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#213E64" />
              <Text style={styles.loadingText}>Generating career bubbles...</Text>
            </View>
          ) : (
            <Animated.View
              style={[
                styles.svgContainer,
                {
                  transform: [
                    { translateX: panRef.x },
                    { translateY: panRef.y },
                    { scale: scale },
                    { perspective: 1000 }
                  ]
                }
              ]}
            >
              <Svg
                ref={svgRef}
                width="100%" 
                height="100%"
                viewBox={`-${Dimensions.get('window').width/1.5} -${Dimensions.get('window').height/1.5} ${Dimensions.get('window').width * 4} ${Dimensions.get('window').height * 4}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {bubblePositions.map((pos, index) => {
                  const isTrending = pos.category.count >= TRENDING_THRESHOLD;
                  const isSelected = selectedCategory?.id === pos.category.id;
                  const isRelated = selectedCategory && pos.category.isRelated && selectedCategory.id !== pos.category.id;
                  
                  // Invenator (Greatness): Calculate appropriate text size based on radius
                  const baseFontSize = Math.min(pos.radius / 2, 800 / pos.category.name.length);
                  const fontSize = Math.min(baseFontSize, 16); // Cap font size
                  
                  // Invenator (Greatness): Get wrapped text lines
                  const textLines = wrapText(pos.category.name, pos.radius);
                  
                  return (
                    <G key={index}>
                      {/* Invenator (Greatness): Background fill circle */}
                      <Circle
                        cx={pos.x}
                        cy={pos.y}
                        r={pos.radius}
                        fill={isTrending ? '#213E64' : 'white'}
                        stroke="none"
                      />
                      
                      {/* Invenator (Greatness): Main Circle border */}
                      <Circle
                        cx={pos.x}
                        cy={pos.y}
                        r={pos.radius}
                        fill="none"
                        stroke={isRelated ? '#649A47' : '#213E64'}
                        strokeWidth={isSelected || isRelated ? 3 : 2}
                        vectorEffect="non-scaling-stroke"
                        onPress={() => handleCategorySelect(pos.category)}
                      />
                      
                      {/* Invenator (Greatness): Render wrapped text lines */}
                      {textLines.map((line, lineIndex) => {
                        // Invenator (Greatness): Calculate vertical position for each line
                        const lineCount = textLines.length;
                        const lineHeight = fontSize * 1.2; // Add some line spacing
                        const totalHeight = lineCount * lineHeight;
                        const yOffset = (lineIndex - (lineCount - 1) / 2) * lineHeight;
                        
                        return (
                          <SvgText
                            key={`text-${index}-${lineIndex}`}
                            x={pos.x}
                            y={pos.y + yOffset}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontSize={fontSize}
                            fontWeight={isSelected ? 'bold' : 'normal'}
                            fill={isTrending ? 'white' : '#213E64'}
                            stroke={isTrending ? 'none' : 'rgba(255,255,255,0.5)'}
                            strokeWidth="1"
                          >
                            {line}
                          </SvgText>
                        );
                      })}
                      
                      {/* Invenator (Greatness): Count Bubble */}
                      <Circle
                        cx={pos.x}
                        cy={pos.y + pos.radius - 16}
                        r={24}
                        fill="#649A47"
                      />
                      
                      {/* Invenator (Greatness): Count Text */}
                      <SvgText
                        x={pos.x}
                        y={pos.y + pos.radius - 16}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize={16}
                        fontWeight="bold"
                        fill="white"
                        stroke="none"
                      >
                        {pos.category.count}
                      </SvgText>
                    </G>
                  );
                })}
              </Svg>
            </Animated.View>
          )}
        </View>
      )}

      {/* Invenator (Greatness): Details Section - Now Scrollable */}
      {selectedCategory && (
        <ScrollView style={styles.detailsScrollContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsHeader}>
              <View style={styles.detailsTitleContainer}>
                <Text style={styles.detailsTitle}>
                  {selectedCategory.name}
                  {selectedCategory.nocCodes && selectedCategory.nocCodes.length > 0 && 
                    ` (${selectedCategory.nocCodes[0]})`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedCategory(null)}
              >
                <Ionicons name="close" size={24} color="#213E64" />
              </TouchableOpacity>
            </View>  
            
            {/* Invenator (Greatness): Trending indicator strip */}
            {selectedCategory.count >= TRENDING_THRESHOLD && (
              <View style={styles.trendingStrip}>
                <Ionicons name="star" size={18} color="#fff" />
                <Text style={styles.trendingText}>This job category is in demand</Text>
              </View>
            )}          

            {/* Invenator (Greatness): Jobs Section - New Expandable Section */}
            <TouchableOpacity
              style={styles.detailSection}
              onPress={() => toggleDetailSection('jobs')}
            >
              <View style={styles.detailSectionHeader}>
                <Text style={styles.detailSectionTitle}>
                  {selectedCategory.count} Active Job Posting(s)
                </Text>
                <Ionicons
                  name={detailsActive.jobs ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#213E64"
                />
              </View>
              {detailsActive.jobs && (
                <View style={styles.jobsList}>
                  {jobsLoading ? (
                    <ActivityIndicator size="small" color="#213E64" style={styles.jobsLoading} />
                  ) : categoryJobs && categoryJobs.length > 0 ? (
                    categoryJobs.map(job => renderJobCard(job))
                  ) : (
                    <Text style={styles.noJobsText}>No jobs available for this category</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.detailSection}
              onPress={() => toggleDetailSection('description')}
            >
              <View style={styles.detailSectionHeader}>
                <Text style={styles.detailSectionTitle}>Job Description</Text>
                <Ionicons
                  name={detailsActive.description ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#213E64"
                />
              </View>
              {detailsActive.description && (
                <Text style={styles.detailContent}>{selectedCategory.description}</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.detailSection}
              onPress={() => toggleDetailSection('skills')}
            >
              <View style={styles.detailSectionHeader}>
                <Text style={styles.detailSectionTitle}>Skills</Text>
                <Ionicons
                  name={detailsActive.skills ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#213E64"
                />
              </View>
              {detailsActive.skills && (
                <View style={styles.skillsList}>
                  {selectedCategory.skills.map((skill, index) => (
                    <View key={index} style={styles.skillItem}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.detailSection}
              onPress={() => toggleDetailSection('salary')}
            >
              <View style={styles.detailSectionHeader}>
                <Text style={styles.detailSectionTitle}>Wage / Salary</Text>
                <Ionicons
                  name={detailsActive.salary ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#213E64"
                />
              </View>
              {detailsActive.salary && (
                <Text style={styles.detailContent}>
                  Average annual salary range: {selectedCategory.salary}
                </Text>
              )}
            </TouchableOpacity>

            {/* Classification Codes section removed */}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 10,
    zIndex: 2, // Ensure it's above the title
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#213E64',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center', // Center the text
    zIndex: 1, // Ensure it's above other elements
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative', // For absolute positioning of children
  },
  headerButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logo: {
    width: 35,
    height: 35,
    marginLeft: 'auto', // Push to the right edge
    zIndex: 2, // Ensure it's above the title
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 5,
    alignItems: 'center',
    gap: 5,
  },
  searchInputContainer: {
    flex: 1, // Restored to take available space
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    height: 35, // Return to original height
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#213E64',
    height: '100%',
    textAlignVertical: 'center', // Helps with cursor alignment
  },
  searchIcon: {
    paddingHorizontal: 10,
    alignSelf: 'center', // Center vertically in container
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#213E64',
    height: '100%',
  },
  filterButton: {
    backgroundColor: '#213E64',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  filterButtonText: {
    marginLeft: 5,
    color: '#213E64',
  },
  searchButton: {},
  explorerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  svgContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#213E64',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#213E64',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  filterModalContent: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#213E64',
  },
  closeButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#213E64',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  searchInput: {
    flex: 1,
    padding: 12,
  },
  searchIcon: {
    padding: 10,
  },
  sectorDropdown: {
    marginBottom: 5,
  },
  bubbleSizeDropdown: {
    marginBottom: 5,
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  dropdownOptions: {
    maxHeight: 150,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  resetButton: {
    backgroundColor: '#213E64',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Invenator (Greatness): Updated scrollable details section
  detailsScrollContainer: {
    maxHeight: 350, // Increased max height to accommodate more content
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to align with top
    marginBottom: 15,
  },
  detailsTitleContainer: {
    flex: 1,
    paddingRight: 10, // Added padding to prevent text from pushing close button
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#213E64',
    flexWrap: 'wrap', // Added to ensure text wraps
  },
  detailsSubtitle: {
    fontSize: 14,
    color: '#649A47',
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#213E64',
    flex: 1, // Allow the title to take available space
    paddingRight: 10, // Add padding for long titles
  },
  detailContent: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    paddingVertical: 5,
  },
  detailsWrapper: {
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  closeButton: {
    padding: 4,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
  skillItem: {
    backgroundColor: '#F0F7EC',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  skillText: {
    color: '#649A47',
    fontSize: 12,
  },
  // Invenator (Greatness): Job listing styles
  jobsList: {
    marginTop: 5,
  },
  jobsLoading: {
    marginVertical: 15,
  },
  noJobsText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
  },
  jobCard: {
    backgroundColor: '#213E64',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  jobCompany: {
    fontSize: 14,
    color: '#cce4ff',
    marginVertical: 4,
  },
  jobDetails: {
    fontSize: 12,
    color: '#cce4ff',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#649A47',
    paddingTop: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 2,
    color: '#213E64',
  },
  activeNavText: {
    color: '#649A47',
    fontWeight: 'bold',
  },
  // Invenator (Greatness): Modal related styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#213E64',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedOption: {
    backgroundColor: '#F0F7EC',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  disabledOption: {
    opacity: 0.5,
  },
  disabledOptionText: {
    color: '#999999',
  },
  sectorList: {
    maxHeight: 400,
  },
  sectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedSector: {
    backgroundColor: '#F0F7EC',
  },
  sectorText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedSectorText: {
    color: '#649A47',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '90%', // Increased to accommodate the bubble size options
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#213E64',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  applyButton: {
    backgroundColor: '#213E64',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff3b30', // Changed from green to red to match JobBoard.js
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeFilterButton: {
    backgroundColor: '#D54128', // Highlighting active trending filter
  },
  checkboxContainer: {
    marginLeft: 'auto',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#213E64',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#213E64',
  },
  trendingStrip: {
    backgroundColor: '#D54128',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10, // Matches the trending/filters buttons radius
    marginBottom: 15,
    gap: 8,
  },
  trendingText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  sectorScrollView: {
    maxHeight: 200, // Limit height so it doesn't take up too much space
  },
  sectorOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedSectorOption: {
    backgroundColor: '#F0F7EC',
  },
  // Invenator (Greatness): New Bubble Size Options styles
  bubbleSizeOptions: {
    marginBottom: 15,
  },
  bubbleSizeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  selectedBubbleSizeOption: {
    backgroundColor: '#F0F7EC',
  },
  bubbleSizeText: {
    fontSize: 16,
    color: '#333333',
  },
  codeSection: {
    marginVertical: 5,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#213E64',
    marginBottom: 5,
  },
  codesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  codeItem: {
    backgroundColor: '#E6F2FF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  codeText: {
    color: '#213E64',
    fontSize: 12,
  },
  moreCodesText: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
    marginLeft: 4,
  },
});

export default CareerExplorer;
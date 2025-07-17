/*=============== BLOG SPECIFIC FUNCTIONALITY ===============*/

// ===== BLOG MANAGER =====
class BlogManager {
  constructor() {
    this.searchInput = document.getElementById('blog-search');
    this.categoryButtons = document.querySelectorAll('.blog-category');
    this.sortSelect = document.getElementById('sort-select');
    this.postsGrid = document.getElementById('blog-posts-grid');
    this.loadMoreButton = document.getElementById('load-more-posts');
    this.newsletterForm = document.querySelector('.newsletter__form');
    
    this.currentCategory = 'all';
    this.currentSort = 'newest';
    this.currentPage = 1;
    this.postsPerPage = 6;
    this.allPosts = [];
    this.filteredPosts = [];
    
    this.init();
  }
  
  init() {
    this.loadPosts();
    this.setupSearch();
    this.setupCategoryFilter();
    this.setupSorting();
    this.setupLoadMore();
    this.setupNewsletter();
    this.setupSocialSharing();
  }
  
  loadPosts() {
    // Simulate loading posts from API
    this.allPosts = [
      {
        id: 1,
        title: "The Perfect Daily Oral Hygiene Routine: A Step-by-Step Guide",
        excerpt: "Master the fundamentals of oral care with our comprehensive guide to daily hygiene. Learn the proper techniques for brushing, flossing, and maintaining optimal oral health.",
        category: "prevention",
        author: "Dr. Vikram Jeet Singh",
        date: "2025-01-15",
        readTime: "5 min read",
        views: 1200,
        likes: 45,
        image: "images/blog-post-1.jpg",
        url: "blog/perfect-daily-oral-hygiene-routine.html",
        featured: false
      },
      {
        id: 2,
        title: "Professional vs. At-Home Teeth Whitening: Which Is Right for You?",
        excerpt: "Compare the effectiveness, safety, and cost of professional and at-home whitening treatments. Discover which option will give you the best results for your lifestyle and budget.",
        category: "cosmetic",
        author: "Dr. Vikram Jeet Singh",
        date: "2025-01-14",
        readTime: "7 min read",
        views: 2100,
        likes: 78,
        image: "images/blog-post-2.jpg",
        url: "blog/professional-vs-home-teeth-whitening.html",
        featured: false
      },
      {
        id: 3,
        title: "Adult Orthodontics: It's Never Too Late to Straighten Your Smile",
        excerpt: "Explore modern orthodontic options for adults, including clear aligners, ceramic braces, and lingual braces. Learn about treatment duration, costs, and what to expect.",
        category: "orthodontics",
        author: "Dr. Vikram Jeet Singh",
        date: "2025-01-13",
        readTime: "8 min read",
        views: 1800,
        likes: 62,
        image: "images/blog-post-3.jpg",
        url: "blog/adult-orthodontics-never-too-late.html",
        featured: false
      },
      {
        id: 4,
        title: "Dental Emergency First Aid: What to Do Before You Reach the Dentist",
        excerpt: "Learn essential first aid techniques for common dental emergencies including knocked-out teeth, severe toothaches, and broken crowns. Quick action can save your tooth and reduce pain.",
        category: "general",
        author: "Dr. Vikram Jeet Singh",
        date: "2025-01-12",
        readTime: "6 min read",
        views: 3200,
        likes: 95,
        image: "images/blog-post-4.jpg",
        url: "blog/dental-emergency-first-aid-guide.html",
        featured: false
      },
      {
        id: 5,
        title: "Dental Implant Recovery: Your Complete Timeline and Care Guide",
        excerpt: "Navigate your dental implant recovery with confidence. This detailed timeline covers what to expect from surgery through osseointegration, plus essential care tips for optimal healing.",
        category: "implants",
        author: "Dr. Vikram Jeet Singh",
        date: "2025-01-11",
        readTime: "9 min read",
        views: 1500,
        likes: 58,
        image: "images/blog-post-5.jpg",
        url: "blog/dental-implant-recovery-timeline.html",
        featured: false
      },
      {
        id: 6,
        title: "Porcelain Veneers vs. Composite Bonding: Making the Right Choice",
        excerpt: "Compare two popular cosmetic dental treatments. Learn about durability, cost, procedure time, and aesthetic outcomes to determine which option best suits your smile goals.",
        category: "cosmetic",
        author: "Dr. Vikram Jeet Singh",
        date: "2025-01-10",
        readTime: "7 min read",
        views: 1900,
        likes: 71,
        image: "images/blog-post-6.jpg",
        url: "blog/veneers-vs-bonding-comparison.html",
        featured: false
      }
    ];
    
    this.filteredPosts = [...this.allPosts];
    this.renderPosts();
  }
  
  setupSearch() {
    if (!this.searchInput) return;
    
    const searchHandler = debounce((e) => {
      const query = e.target.value.toLowerCase().trim();
      this.filterPosts(query);
    }, 300);
    
    this.searchInput.addEventListener('input', searchHandler);
    
    // Clear search
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.searchInput.value = '';
        this.filterPosts('');
      }
    });
  }
  
  setupCategoryFilter() {
    this.categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active state
        this.categoryButtons.forEach(btn => btn.classList.remove('blog-category--active'));
        button.classList.add('blog-category--active');
        
        // Filter posts
        this.currentCategory = button.dataset.category;
        this.currentPage = 1;
        this.filterAndSortPosts();
      });
    });
  }
  
  setupSorting() {
    if (!this.sortSelect) return;
    
    this.sortSelect.addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.currentPage = 1;
      this.filterAndSortPosts();
    });
  }
  
  setupLoadMore() {
    if (!this.loadMoreButton) return;
    
    this.loadMoreButton.addEventListener('click', () => {
      this.currentPage++;
      this.renderPosts(true);
    });
  }
  
  filterPosts(query = '') {
    const searchQuery = this.searchInput ? this.searchInput.value.toLowerCase().trim() : query;
    
    this.filteredPosts = this.allPosts.filter(post => {
      const matchesCategory = this.currentCategory === 'all' || post.category === this.currentCategory;
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery) ||
        post.excerpt.toLowerCase().includes(searchQuery) ||
        post.category.toLowerCase().includes(searchQuery);
      
      return matchesCategory && matchesSearch;
    });
    
    this.currentPage = 1;
    this.sortPosts();
    this.renderPosts();
  }
  
  filterAndSortPosts() {
    this.filterPosts();
  }
  
  sortPosts() {
    this.filteredPosts.sort((a, b) => {
      switch (this.currentSort) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  }
  
  renderPosts(append = false) {
    if (!this.postsGrid) return;
    
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    const postsToShow = this.filteredPosts.slice(0, endIndex);
    
    if (!append) {
      this.postsGrid.innerHTML = '';
    }
    
    const newPosts = this.filteredPosts.slice(startIndex, endIndex);
    
    newPosts.forEach((post, index) => {
      const postElement = this.createPostElement(post);
      postElement.style.animationDelay = `${index * 0.1}s`;
      this.postsGrid.appendChild(postElement);
    });
    
    // Update load more button
    if (this.loadMoreButton) {
      if (endIndex >= this.filteredPosts.length) {
        this.loadMoreButton.style.display = 'none';
      } else {
        this.loadMoreButton.style.display = 'block';
      }
    }
    
    // Show no results message
    if (this.filteredPosts.length === 0) {
      this.showNoResults();
    }
  }
  
  createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-card stagger-item';
    article.dataset.category = post.category;
    
    article.innerHTML = `
      <div class="blog-card__media">
        <img src="${post.image}" alt="${post.title}" class="blog-card__image" loading="lazy">
        <div class="blog-card__category">${this.getCategoryName(post.category)}</div>
      </div>
      <div class="blog-card__content">
        <div class="blog-card__meta">
          <time class="blog-card__date" datetime="${post.date}">${this.formatDate(post.date)}</time>
          <span class="blog-card__read-time">${post.readTime}</span>
        </div>
        <h3 class="blog-card__title">
          <a href="${post.url}">${post.title}</a>
        </h3>
        <p class="blog-card__excerpt">${post.excerpt}</p>
        <div class="blog-card__footer">
          <div class="blog-card__author">
            <img src="images/dr-vikram-small.jpg" alt="${post.author}" class="blog-card__author-avatar" loading="lazy">
            <span class="blog-card__author-name">${post.author}</span>
          </div>
          <div class="blog-card__stats">
            <span class="blog-card__views">${this.formatNumber(post.views)} views</span>
            <span class="blog-card__likes">${post.likes} likes</span>
          </div>
        </div>
      </div>
    `;
    
    return article;
  }
  
  showNoResults() {
    this.postsGrid.innerHTML = `
      <div class="no-results">
        <div class="no-results__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <h3 class="no-results__title">No articles found</h3>
        <p class="no-results__text">
          Try adjusting your search terms or browse different categories.
        </p>
        <button class="btn btn--primary" onclick="blogManager.clearFilters()">
          Clear Filters
        </button>
      </div>
    `;
  }
  
  clearFilters() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    
    this.categoryButtons.forEach(btn => btn.classList.remove('blog-category--active'));
    this.categoryButtons[0].classList.add('blog-category--active');
    
    this.currentCategory = 'all';
    this.currentSort = 'newest';
    this.currentPage = 1;
    
    if (this.sortSelect) {
      this.sortSelect.value = 'newest';
    }
    
    this.filterAndSortPosts();
  }
  
  setupNewsletter() {
    if (!this.newsletterForm) return;
    
    this.newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const emailInput = this.newsletterForm.querySelector('#newsletter-email');
      const submitButton = this.newsletterForm.querySelector('button[type="submit"]');
      const email = emailInput.value.trim();
      
      if (!this.validateEmail(email)) {
        this.showNewsletterMessage('Please enter a valid email address', 'error');
        return;
      }
      
      // Show loading state
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="loading-spinner"></span> Subscribing...';
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        this.showNewsletterMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
        emailInput.value = '';
        
        // Track subscription
        if (window.gtag) {
          gtag('event', 'newsletter_signup', {
            event_category: 'Engagement',
            event_label: 'Blog Newsletter'
          });
        }
      } catch (error) {
        this.showNewsletterMessage('Sorry, there was an error. Please try again.', 'error');
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    });
  }
  
  setupSocialSharing() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.featured-post__social-link, .blog-card__share')) {
        e.preventDefault();
        
        const link = e.target.closest('a');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        let shareUrl = '';
        
        if (link.href.includes('facebook')) {
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        } else if (link.href.includes('twitter')) {
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        } else if (link.href.includes('linkedin')) {
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        }
        
        if (shareUrl) {
          window.open(shareUrl, 'share', 'width=600,height=400');
        }
      }
    });
  }
  
  showNewsletterMessage(message, type) {
    let messageElement = this.newsletterForm.querySelector('.newsletter-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'newsletter-message';
      this.newsletterForm.appendChild(messageElement);
    }
    
    messageElement.className = `newsletter-message newsletter-message--${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    if (type === 'success') {
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 5000);
    }
  }
  
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  getCategoryName(category) {
    const categoryNames = {
      'general': 'General',
      'cosmetic': 'Cosmetic',
      'orthodontics': 'Orthodontics',
      'implants': 'Implants',
      'prevention': 'Prevention'
    };
    return categoryNames[category] || category;
  }
  
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
}

// ===== FAQ FUNCTIONALITY =====
class FAQManager {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.init();
  }
  
  init() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-item__question');
      const answer = item.querySelector('.faq-item__answer');
      
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        this.faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherQuestion = otherItem.querySelector('.faq-item__question');
            const otherAnswer = otherItem.querySelector('.faq-item__answer');
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.style.maxHeight = '0';
          }
        });
        
        // Toggle current item
        question.setAttribute('aria-expanded', !isExpanded);
        
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    });
  }
}

// ===== READING PROGRESS =====
class ReadingProgress {
  constructor() {
    this.progressBar = this.createProgressBar();
    this.init();
  }
  
  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress__fill"></div>';
    document.body.appendChild(progressBar);
    return progressBar;
  }
  
  init() {
    window.addEventListener('scroll', throttle(() => {
      this.updateProgress();
    }, 10));
  }
  
  updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const fill = this.progressBar.querySelector('.reading-progress__fill');
    fill.style.width = scrolled + '%';
  }
}

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===== INITIALIZATION =====
let blogManager;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize blog-specific functionality
  blogManager = new BlogManager();
  new FAQManager();
  new ReadingProgress();
  
  console.log('📝 Blog functionality loaded successfully!');
});


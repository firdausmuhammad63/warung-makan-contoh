// Global variables
        let isLoading = false;
        let currentSection = 'home';
        
        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeAnimations();
            initializeScrollEffects();
            initializeTypingEffect();
            initializeCounters();
            initializeImageLazyLoading();
            initializeTooltips();
        });

        // FAQ Toggle Function with enhanced animation
        function toggleFAQ(index) {
            const answer = document.getElementById(`answer-${index}`);
            const icon = document.getElementById(`icon-${index}`);
            const button = icon.parentElement;
            
            // Close other FAQs
            for (let i = 1; i <= 4; i++) {
                if (i !== index) {
                    const otherAnswer = document.getElementById(`answer-${i}`);
                    const otherIcon = document.getElementById(`icon-${i}`);
                    if (!otherAnswer.classList.contains('hidden')) {
                        otherAnswer.classList.add('hidden');
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }
            
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
                button.classList.add('bg-purple-50');
                
                // Smooth reveal animation
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
                setTimeout(() => {
                    answer.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
                    answer.style.maxHeight = '200px';
                    answer.style.opacity = '1';
                }, 10);
            } else {
                answer.style.maxHeight = '0px';
                answer.style.opacity = '0';
                icon.style.transform = 'rotate(0deg)';
                button.classList.remove('bg-purple-50');
                
                setTimeout(() => {
                    answer.classList.add('hidden');
                }, 300);
            }
        }

        // Enhanced Mobile Menu Toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        let mobileMenuOpen = false;
        
        mobileMenuButton.addEventListener('click', function() {
            mobileMenuOpen = !mobileMenuOpen;
            
            if (mobileMenuOpen) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.style.transform = 'translateY(-10px)';
                mobileMenu.style.opacity = '0';
                
                setTimeout(() => {
                    mobileMenu.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    mobileMenu.style.transform = 'translateY(0)';
                    mobileMenu.style.opacity = '1';
                }, 10);
                
                // Change hamburger to X
                mobileMenuButton.innerHTML = `
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
            } else {
                mobileMenu.style.transform = 'translateY(-10px)';
                mobileMenu.style.opacity = '0';
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                // Change X back to hamburger
                mobileMenuButton.innerHTML = `
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                `;
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuOpen = false;
                mobileMenu.style.transform = 'translateY(-10px)';
                mobileMenu.style.opacity = '0';
                
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 300);
                
                mobileMenuButton.innerHTML = `
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                `;
            });
        });

        // Order Form Handler
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const customerName = formData.get('customerName').trim();
            const customerPhone = formData.get('customerPhone').trim();
            const orderType = formData.get('orderType');
            const deliveryAddress = formData.get('deliveryAddress').trim();
            const orderNotes = formData.get('orderNotes').trim();
            
            // Validate required fields
            if (!customerName || !customerPhone || !orderType) {
                alert('Mohon lengkapi semua field yang diperlukan!');
                return;
            }
            
            // Get selected menu items
            const selectedMenus = [];
            const menuCheckboxes = document.querySelectorAll('input[name="menu"]:checked');
            
            if (menuCheckboxes.length === 0) {
                alert('Mohon pilih minimal satu menu!');
                return;
            }
            
            menuCheckboxes.forEach(checkbox => {
                const menuItem = checkbox.closest('.menu-item');
                const quantityInput = menuItem.querySelector('input[type="number"]');
                const quantity = quantityInput ? quantityInput.value : 1;
                selectedMenus.push(`${checkbox.value} x${quantity}`);
            });
            
            // Validate delivery address if needed
            if (orderType === 'delivery' && !deliveryAddress) {
                alert('Mohon masukkan alamat pengiriman untuk layanan delivery!');
                return;
            }
            
            // Create WhatsApp message
            let message = `*PESANAN BARU - WARUNG NUSANTARA*\n\n`;
            message += `- *Nama:* ${customerName}\n`;
            message += `- *No. HP:* ${customerPhone}\n`;
            message += `- *Jenis Layanan:* ${getServiceName(orderType)}\n`;
            
            if (orderType === 'delivery' && deliveryAddress) {
                message += `- *Alamat:* ${deliveryAddress}\n`;
            }
            
            message += `\n- *PESANAN:*\n`;
            selectedMenus.forEach(menu => {
                message += `• ${menu}\n`;
            });
            
            const totalPrice = calculateTotal();
            message += `\n- *Total Harga:* Rp ${totalPrice.toLocaleString('id-ID')}\n`;
            
            if (orderNotes) {
                message += `\n- *Catatan:* ${orderNotes}\n`;
            }
            
            message += `\n_Pesanan dikirim melalui website Warung Nusantara_`;
            
            // Encode message for WhatsApp URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/62895413263355?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappURL, '_blank', 'noopener,noreferrer');
            
            // Show success message
            alert('Pesanan Anda akan dikirim ke WhatsApp pemilik warung. Terima kasih!');
            
            // Reset form
            this.reset();
            updateOrderSummary();
        });
        
        // Helper function to get service name
        function getServiceName(serviceType) {
            const serviceNames = {
                'dine-in': 'Dine In - Makan di tempat',
                'delivery': 'Delivery - Antar ke alamat',
                'takeaway': 'Take Away - Ambil sendiri',
                'catering': 'Catering - Pesanan besar'
            };
            return serviceNames[serviceType] || serviceType;
        }
        
        // Show/hide address field based on order type
        document.getElementById('orderType').addEventListener('change', function() {
            const addressField = document.getElementById('addressField');
            const deliveryAddress = document.getElementById('deliveryAddress');
            
            if (this.value === 'delivery') {
                addressField.classList.remove('hidden');
                deliveryAddress.required = true;
            } else {
                addressField.classList.add('hidden');
                deliveryAddress.required = false;
                deliveryAddress.value = '';
            }
        });
        
        // Handle menu selection and quantity
        document.querySelectorAll('input[name="menu"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const menuItem = this.closest('.menu-item');
                const quantityControl = menuItem.querySelector('.quantity-control');
                
                if (this.checked) {
                    quantityControl.classList.remove('hidden');
                    menuItem.classList.add('border-purple-500', 'bg-purple-50');
                } else {
                    quantityControl.classList.add('hidden');
                    menuItem.classList.remove('border-purple-500', 'bg-purple-50');
                }
                
                updateOrderSummary();
            });
        });
        
        // Handle quantity changes
        document.querySelectorAll('.quantity-control input[type="number"]').forEach(input => {
            input.addEventListener('change', updateOrderSummary);
        });
        
        // Update order summary
        function updateOrderSummary() {
            const orderSummary = document.getElementById('orderSummary');
            const totalPrice = document.getElementById('totalPrice');
            const selectedMenus = [];
            let total = 0;
            
            document.querySelectorAll('input[name="menu"]:checked').forEach(checkbox => {
                const menuItem = checkbox.closest('.menu-item');
                const quantityInput = menuItem.querySelector('input[type="number"]');
                const quantity = parseInt(quantityInput.value) || 1;
                const menuText = checkbox.value;
                const price = parseInt(menuText.match(/Rp (\d+)/)[1]) * 1000;
                const itemTotal = price * quantity;
                
                selectedMenus.push(`${menuText} x${quantity} = Rp ${itemTotal.toLocaleString('id-ID')}`);
                total += itemTotal;
            });
            
            if (selectedMenus.length === 0) {
                orderSummary.textContent = 'Belum ada menu yang dipilih';
                totalPrice.textContent = 'Total: Rp 0';
            } else {
                orderSummary.innerHTML = selectedMenus.join('<br>');
                totalPrice.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
            }
        }
        
        // Calculate total price
        function calculateTotal() {
            let total = 0;
            document.querySelectorAll('input[name="menu"]:checked').forEach(checkbox => {
                const menuItem = checkbox.closest('.menu-item');
                const quantityInput = menuItem.querySelector('input[type="number"]');
                const quantity = parseInt(quantityInput.value) || 1;
                const menuText = checkbox.value;
                const price = parseInt(menuText.match(/Rp (\d+)/)[1]) * 1000;
                total += price * quantity;
            });
            return total;
        }

        // Enhanced Contact Form Handler with validation
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (isLoading) return;
            
            const formData = new FormData(this);
            const messageDiv = document.getElementById('formMessage');
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Validate form
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const phone = formData.get('phone').trim();
            const subject = formData.get('subject');
            const message = formData.get('message').trim();
            
            if (!name || !email || !phone || !subject || !message) {
                showMessage('Mohon lengkapi semua field yang diperlukan!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Format email tidak valid!', 'error');
                return;
            }
            
            if (!isValidPhone(phone)) {
                showMessage('Format nomor telepon tidak valid!', 'error');
                return;
            }
            
            // Show loading state
            isLoading = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Mengirim...';
            submitButton.disabled = true;
            
            // Simulate form submission with delay
            setTimeout(() => {
                showMessage('Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.', 'success');
                
                // Reset form with animation
                this.reset();
                
                // Reset button
                isLoading = false;
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                
                // Add success animation to form
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transition = 'transform 0.3s ease';
                    this.style.transform = 'scale(1)';
                }, 100);
                
            }, 2000);
        });

        // Helper functions for form validation
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        function isValidPhone(phone) {
            const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
            return phoneRegex.test(phone.replace(/[\s-]/g, ''));
        }
        
        function showMessage(text, type) {
            const messageDiv = document.getElementById('formMessage');
            
            if (type === 'success') {
                messageDiv.className = 'mt-4 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700';
            } else {
                messageDiv.className = 'mt-4 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700';
            }
            
            messageDiv.textContent = text;
            messageDiv.classList.remove('hidden');
            
            // Animate message appearance
            messageDiv.style.transform = 'translateY(-10px)';
            messageDiv.style.opacity = '0';
            
            setTimeout(() => {
                messageDiv.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                messageDiv.style.transform = 'translateY(0)';
                messageDiv.style.opacity = '1';
            }, 10);
            
            // Hide message after 5 seconds
            setTimeout(() => {
                messageDiv.style.transform = 'translateY(-10px)';
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    messageDiv.classList.add('hidden');
                }, 300);
            }, 5000);
        }

        // Enhanced smooth scrolling with active section tracking
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active navigation
                    updateActiveNavigation(this.getAttribute('href').substring(1));
                }
            });
        });

        // Initialize scroll-based animations
        function initializeAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                        
                        // Update current section
                        const sectionId = entry.target.id;
                        if (sectionId) {
                            currentSection = sectionId;
                            updateActiveNavigation(sectionId);
                        }
                    }
                });
            }, observerOptions);
            
            // Observe all sections
            document.querySelectorAll('section').forEach(section => {
                observer.observe(section);
            });
            
            // Observe gallery items for staggered animation
            document.querySelectorAll('.gallery-item').forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                observer.observe(item);
            });
            
            // Observe service cards
            document.querySelectorAll('.service-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                observer.observe(card);
            });
        }

        // Initialize scroll effects
        function initializeScrollEffects() {
            let ticking = false;
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
        
        function handleScroll() {
            const scrollY = window.scrollY;
            const nav = document.querySelector('nav');
            
            // Navigation background effect
            if (scrollY > 100) {
                nav.classList.add('bg-white', 'shadow-lg');
                nav.style.backdropFilter = 'blur(10px)';
            } else {
                nav.classList.remove('shadow-lg');
                nav.style.backdropFilter = 'none';
            }
            
            // Parallax effect for hero section
            const hero = document.getElementById('home');
            if (hero) {
                const heroOffset = scrollY * 0.5;
                hero.style.transform = `translateY(${heroOffset}px)`;
            }
            
            // Show/hide WhatsApp button based on scroll
            const waButton = document.querySelector('.floating-wa');
            if (scrollY > 300) {
                waButton.style.opacity = '1';
                waButton.style.transform = 'scale(1)';
            } else {
                waButton.style.opacity = '0.7';
                waButton.style.transform = 'scale(0.8)';
            }
        }

        // Update active navigation
        function updateActiveNavigation(sectionId) {
            // Remove active class from all nav links
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('text-purple-600', 'font-bold');
                link.classList.add('text-gray-700');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`nav a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.remove('text-gray-700');
                activeLink.classList.add('text-purple-600', 'font-bold');
            }
        }

        // Initialize typing effect for hero section
        function initializeTypingEffect() {
            const subtitle = document.querySelector('#home p');
            if (subtitle) {
                const text = subtitle.textContent;
                subtitle.textContent = '';
                subtitle.style.borderRight = '2px solid white';
                
                let i = 0;
                const typeWriter = () => {
                    if (i < text.length) {
                        subtitle.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, 50);
                    } else {
                        subtitle.style.borderRight = 'none';
                    }
                };
                
                // Start typing effect after a delay
                setTimeout(typeWriter, 1000);
            }
        }

        // Initialize counters animation
        function initializeCounters() {
            const counters = [
                { element: null, target: 1000, suffix: '+', label: 'Pelanggan Puas' },
                { element: null, target: 50, suffix: '+', label: 'Menu Tersedia' },
                { element: null, target: 5, suffix: ' Tahun', label: 'Pengalaman' }
            ];
            
            // Create counter elements if they don't exist
            const servicesSection = document.getElementById('services');
            if (servicesSection && !document.querySelector('.counter-stats')) {
                const counterHTML = `
                    <div class="counter-stats bg-purple-600 text-white py-12 mt-12 rounded-xl">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div>
                                <div class="text-3xl sm:text-4xl font-bold mb-2" id="counter-1">0</div>
                                <div class="text-sm sm:text-base">Pelanggan Puas</div>
                            </div>
                            <div>
                                <div class="text-3xl sm:text-4xl font-bold mb-2" id="counter-2">0</div>
                                <div class="text-sm sm:text-base">Menu Tersedia</div>
                            </div>
                            <div>
                                <div class="text-3xl sm:text-4xl font-bold mb-2" id="counter-3">0</div>
                                <div class="text-sm sm:text-base">Tahun Pengalaman</div>
                            </div>
                        </div>
                    </div>
                `;
                servicesSection.insertAdjacentHTML('beforeend', counterHTML);
                
                // Set counter elements
                counters[0].element = document.getElementById('counter-1');
                counters[1].element = document.getElementById('counter-2');
                counters[2].element = document.getElementById('counter-3');
                
                // Animate counters when visible
                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCounters();
                            counterObserver.unobserve(entry.target);
                        }
                    });
                });
                
                counterObserver.observe(document.querySelector('.counter-stats'));
            }
            
            function animateCounters() {
                counters.forEach((counter, index) => {
                    if (counter.element) {
                        let current = 0;
                        const increment = counter.target / 100;
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= counter.target) {
                                current = counter.target;
                                clearInterval(timer);
                            }
                            counter.element.textContent = Math.floor(current) + counter.suffix;
                        }, 20);
                    }
                });
            }
        }

        // Initialize image lazy loading effect
        function initializeImageLazyLoading() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            galleryItems.forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05) rotate(1deg)';
                    this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1) rotate(0deg)';
                    this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                });
            });
        }

        // Initialize tooltips
        function initializeTooltips() {
            // Add tooltips to social media links
            const socialLinks = document.querySelectorAll('footer a[href="#"]');
            const tooltips = ['Facebook', 'Instagram', 'Twitter'];
            
            socialLinks.forEach((link, index) => {
                if (tooltips[index]) {
                    link.setAttribute('title', `Ikuti kami di ${tooltips[index]}`);
                    
                    link.addEventListener('mouseenter', function() {
                        this.style.transform = 'scale(1.2)';
                    });
                    
                    link.addEventListener('mouseleave', function() {
                        this.style.transform = 'scale(1)';
                    });
                }
            });
        }

        // Add keyboard navigation support
        document.addEventListener('keydown', function(e) {
            // ESC key closes mobile menu
            if (e.key === 'Escape' && mobileMenuOpen) {
                mobileMenuButton.click();
            }
            
            // Arrow keys for FAQ navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                const faqButtons = document.querySelectorAll('.faq-item button');
                const currentFocus = document.activeElement;
                const currentIndex = Array.from(faqButtons).indexOf(currentFocus);
                
                if (currentIndex !== -1) {
                    e.preventDefault();
                    let nextIndex;
                    
                    if (e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % faqButtons.length;
                    } else {
                        nextIndex = (currentIndex - 1 + faqButtons.length) % faqButtons.length;
                    }
                    
                    faqButtons[nextIndex].focus();
                }
            }
        });

        // Add loading animation for page
        window.addEventListener('load', function() {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });

        // Add custom CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fade-in {
                animation: fadeIn 0.6s ease forwards;
            }
            
            .gallery-item, .service-card {
                opacity: 0;
                transform: translateY(30px);
            }
            
            .gallery-item.animate-fade-in, .service-card.animate-fade-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Smooth transitions for all interactive elements */
            * {
                transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    



        
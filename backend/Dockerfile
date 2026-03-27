FROM php:8.2-apache

# Install required system packages
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libpq-dev \
    unzip \
    git \
    zip \
    && rm -rf /var/lib/apt/lists/*

# Install and configure PHP extensions required by CodeIgniter 4
RUN docker-php-ext-configure intl \
    && docker-php-ext-install intl \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Setup apache DocumentRoot to public directory
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

WORKDIR /var/www/html

# Copy the application codebase into the image
COPY . /var/www/html

# Install dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Give Apache permissions to writing to the CI4 writable directory
RUN chown -R www-data:www-data /var/www/html/writable /var/www/html/public

#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Get the release version from the latest git tag
RELEASE_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "0.1.0")
ZIP_NAME="cookiex-cmp-${RELEASE_VERSION}.zip"

# Remove the existing ZIP file if it exists
rm -f "${ZIP_NAME}"

# Define the build directory
BUILD_DIR="build"

# Remove the build directory if it exists
rm -rf "${BUILD_DIR}"
rm -rf "dist"

# Install PHP dependencies without development packages
composer install

# Install Node.js dependencies without development packages
npm install

# Build assets (if you have a build script in package.json)
npm run production

mkdir -p "${BUILD_DIR}"

# Copy all files to the build directory, excluding undesired files and directories
rsync -a --exclude=".git" \
          --exclude=".gitignore" \
          --exclude=".github" \
          --exclude="composer.json" \
          --exclude="node_modules" \
          --exclude="composer.lock" \
          --exclude="package.json" \
          --exclude="package-lock.json" \
          --exclude="phpunit.xml.dist" \
          --exclude="phpcs.xml" \
          --exclude="phpstan.neon" \
          --exclude="phpcs-report.xml" \
          --exclude="eslint.config.js" \
          --exclude="bud.config.js" \
          --exclude="tests/" \
          --exclude="bin/" \
          --exclude="${BUILD_DIR}/" \
          --exclude="cookiex-cmp-*.zip" \
          ./ "${BUILD_DIR}/"

# Change to the build directory
cd "${BUILD_DIR}"

# Update version numbers in WordPress files
sed -i.bak "s/\(const PLUGIN_VERSION = '\)[^']*\(';*\)/\1${RELEASE_VERSION}\2/" src/Cookiex_CMP.php && rm src/Cookiex_CMP.php.bak
sed -i.bak "s/\([[:blank:]]*\*[[:blank:]]*Version:[[:blank:]]*\).*/\1${RELEASE_VERSION}/" cookiex-cmp.php && rm cookiex-cmp.php.bak
sed -i.bak "s/Stable tag: .*/Stable tag: ${RELEASE_VERSION}/" README.txt && rm README.txt.bak

# Move back to the root directory
cd ..

cd "${BUILD_DIR}"
zip -rq "../${ZIP_NAME}" ./*

# Return to the root directory
cd ..

echo "Build complete: ${ZIP_NAME}"

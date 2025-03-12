({
  onWillParseMarkdown: async function(markdown) {
    let processedMarkdown = markdown;
    
    // -------------------------
    // Step 1: Process YAML frontmatter
    // -------------------------
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const frontmatterMatch = processedMarkdown.match(frontmatterRegex);
    
    if (frontmatterMatch) {
      const frontmatterRaw = frontmatterMatch[1];
      const contentAfterFrontmatter = processedMarkdown.slice(frontmatterMatch[0].length);
      
      // Parse YAML frontmatter
      const metadata = {};
      const lines = frontmatterRaw.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) continue;
        
        const key = line.slice(0, separatorIndex).trim();
        let value = line.slice(separatorIndex + 1).trim();
        
        // Handle array values like tags: [tag1, tag2]
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value
            .slice(1, -1)
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        }
        
        metadata[key] = value;
      }
      
      // Generate HTML for the frontmatter
      let frontmatterHTML = '<div class="mpe-frontmatter">\n';
      
      if (metadata.title) {
        frontmatterHTML += `  <div class="mpe-frontmatter-title">${metadata.title}</div>\n`;
      }
      
      if (metadata.author) {
        frontmatterHTML += `  <div class="mpe-frontmatter-author">By ${metadata.author}</div>\n`;
      }
      
      // Handle tags (check both 'tag' and 'tags' fields)
      let allTags = [];
      
      // Process 'tag' field - can be a string with comma-separated values
      if (metadata.tag) {
        if (typeof metadata.tag === 'string') {
          const parsedTags = metadata.tag.split(',').map(t => t.trim()).filter(t => t);
          allTags = allTags.concat(parsedTags);
        } else if (Array.isArray(metadata.tag)) {
          allTags = allTags.concat(metadata.tag);
        }
      }
      
      // Process 'tags' field - can be an array or a string
      if (metadata.tags) {
        if (typeof metadata.tags === 'string') {
          const parsedTags = metadata.tags.split(',').map(t => t.trim()).filter(t => t);
          allTags = allTags.concat(parsedTags);
        } else if (Array.isArray(metadata.tags)) {
          allTags = allTags.concat(metadata.tags);
        }
      }
      
      // Display all collected tags
      if (allTags.length > 0) {
        frontmatterHTML += '  <div class="mpe-frontmatter-tags">\n';
        for (const tag of allTags) {
          frontmatterHTML += `    <span class="mpe-frontmatter-tag">${tag}</span>\n`;
        }
        frontmatterHTML += '  </div>\n';
      }
      
      // Add any other metadata fields
      const displayedFields = ['title', 'author', 'tags', 'tag'];
      const otherFields = Object.keys(metadata).filter(key => !displayedFields.includes(key));
      
      if (otherFields.length > 0) {
        frontmatterHTML += '  <div class="mpe-frontmatter-other">\n';
        for (const key of otherFields) {
          frontmatterHTML += `    <div class="mpe-frontmatter-field"><span class="mpe-frontmatter-key">${key}:</span> <span class="mpe-frontmatter-value">${metadata[key]}</span></div>\n`;
        }
        frontmatterHTML += '  </div>\n';
      }
      
      frontmatterHTML += '</div>\n\n';
      
      // Replace frontmatter with HTML
      processedMarkdown = frontmatterHTML + contentAfterFrontmatter;
    }
    
    // -------------------------
    // Step 2: Process TOC
    // -------------------------
    if (processedMarkdown.includes('[TOC]') || processedMarkdown.includes('<!-- toc -->')) {
      // Get all headings from the document
      const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\{#([^}]+)\})?\s*$/gm;
      const headings = [];
      let match;
      
      while ((match = headingRegex.exec(processedMarkdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        
        // Generate slug for heading
        const id = match[3] || text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-')     // Replace spaces with hyphens
          .replace(/--+/g, '-')     // Replace multiple hyphens with single hyphen
          .trim();
        
        headings.push({
          level,
          text,
          id
        });
      }
      
      // Generate TOC HTML
      let tocHtml = '<div class="mpe-toc">\n';
      tocHtml += '  <div class="mpe-toc-title">目次</div>\n';
      tocHtml += '  <div class="mpe-toc-content">\n';
      
      // Track current and previous levels for proper nesting
      let currentLevel = 0;
      
      headings.forEach(heading => {
        // Handle level changes
        if (heading.level > currentLevel) {
          // Start new list(s) for deeper nesting
          for (let i = 0; i < heading.level - currentLevel; i++) {
            tocHtml += '    <ul class="mpe-toc-list">\n';
          }
        } else if (heading.level < currentLevel) {
          // Close current list(s) when going back up
          for (let i = 0; i < currentLevel - heading.level; i++) {
            tocHtml += '    </ul>\n';
          }
        }
        
        // Add the TOC entry
        tocHtml += `      <li class="mpe-toc-item mpe-toc-item-level-${heading.level}">
          <a class="mpe-toc-link" href="#${heading.id}">${heading.text}</a>
        </li>\n`;
        
        // Update current level
        currentLevel = heading.level;
      });
      
      // Close any remaining open lists
      for (let i = 0; i < currentLevel; i++) {
        tocHtml += '    </ul>\n';
      }
      
      tocHtml += '  </div>\n';
      tocHtml += '</div>\n\n';
      
      // Replace TOC markers with the generated TOC
      processedMarkdown = processedMarkdown
        .replace('[TOC]', tocHtml)
        .replace('<!-- toc -->', tocHtml);
    }
    
    return processedMarkdown;
  },
  
  onDidParseMarkdown: async function(html) {
    return html;
  }
})
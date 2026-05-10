document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    const postFeed = document.getElementById('postFeed');

    // --- 5. CREATE POST (Fixed closing brackets) ---
    window.createNewPost = async () => {
        const titleEl = document.getElementById('postTitle');
        const contentEl = document.getElementById('postContent');
        const tagsEl = document.getElementById('postTags');

        if (!titleEl.value || !contentEl.value) {
            alert("Please fill in title and content");
            return;
        }

        try {
            const res = await fetchWithAuth('/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: titleEl.value,
                    content: contentEl.value,
                    tags: tagsEl ? tagsEl.value : ''
                })
            });
            const result = await res.json();

            if (res.ok && result.success) {
                alert("Draft saved!");
                titleEl.value = '';
                contentEl.value = '';
                if (tagsEl) tagsEl.value = '';
                
                if (window.location.pathname === '/profile') {
                    loadProfile();
                } else {
                    if (typeof loadFeed === 'function') loadFeed();
                }
            } else {
                alert("Error: " + (result.message || "Could not create post"));
            }
        } catch (err) {
            console.error("Create post error:", err);
            alert("Error creating post");
        }
    };

    // --- 6. LOAD PROFILE & DRAFTS ---
    window.loadProfile = async () => {
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        try {
            const res = await fetchWithAuth('/api/posts/my-posts');
            const result = await res.json();

            if (res.ok && result.success) {
                const posts = result.data.posts || [];
                const drafts = posts.filter(p => p.state === 'draft');
                const published = posts.filter(p => p.state === 'published');

                const draftsList = document.getElementById('draftsList');
                if (draftsList) {
                    draftsList.innerHTML = drafts.length > 0 
                        ? drafts.map(p => `
                            <div class="card apple-glass">
                                <h4>${escapeHtml(p.title)}</h4>
                                <p>${escapeHtml(p.content.substring(0, 100))}...</p>
                                <button class="btn-primary" onclick="publishPost('${p._id}')">Publish Now</button>
                                <button class="action-btn" onclick="deletePost('${p._id}')">Delete</button>
                            </div>
                        `).join('')
                        : '<p>No drafts yet. Create your first post above!</p>';
                }

                const pubList = document.getElementById('publishedList');
                if (pubList) {
                    pubList.innerHTML = published.length > 0
                        ? published.map(p => `
                            <div class="card apple-glass">
                                <h4>${escapeHtml(p.title)}</h4>
                                <p>${escapeHtml(p.content.substring(0, 100))}...</p>
                                <small>❤️ ${p.like_count || 0} likes | 📅 ${new Date(p.created_at).toLocaleDateString()}</small>
                                <button class="action-btn" onclick="deletePost('${p._id}')">Delete</button>
                            </div>
                        `).join('')
                        : '<p>No published posts yet.</p>';
                }
            }
        } catch (err) {
            console.error("Profile Error:", err);
        }
    };

    // --- 7. PUBLISH POST FROM DRAFT ---
    window.publishPost = async (id) => {
        try {
            const res = await fetchWithAuth(`/api/posts/${id}/publish`, {
                method: 'PATCH'
            });
            
            if (res.ok) {
                alert("🚀 Post published successfully!");
                loadProfile();
                if (typeof loadFeed === 'function') loadFeed();
            } else {
                alert("Error publishing post");
            }
        } catch (err) {
            alert("Error publishing post");
        }
    };

    // --- 8. DELETE POST ---
    window.deletePost = async (id) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        
        try {
            const res = await fetchWithAuth(`/api/posts/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                alert("Post deleted successfully!");
                loadProfile();
                if (window.location.pathname === '/' && typeof loadFeed === 'function') loadFeed();
            } else {
                alert("Error deleting post");
            }
        } catch (err) {
            alert("Error deleting post");
        }
    };

    // --- 9. LOGOUT ---
    window.handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
    };

    // --- HELPER: Escape HTML ---
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- PAGINATION & TABS ---
    let currentPage = 1;
    let currentFeedType = 'explore';
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                loadFeed(currentPage, currentFeedType);
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            currentPage++;
            loadFeed(currentPage, currentFeedType);
        };
    }

    const exploreTab = document.getElementById('exploreTab');
    const feedTab = document.getElementById('feedTab');
    
    if (exploreTab) {
        exploreTab.onclick = () => {
            currentFeedType = 'explore';
            currentPage = 1;
            loadFeed(1, 'explore');
        };
    }
    
    if (feedTab && token) {
        feedTab.onclick = () => {
            currentFeedType = 'feed';
            currentPage = 1;
            loadFeed(1, 'feed');
        };
    }

    // --- INITIAL LOAD ---
    if (window.location.pathname === '/profile') {
        loadProfile();
    } else if (postFeed && typeof loadFeed === 'function') {
        loadFeed(currentPage, currentFeedType);
    }
});

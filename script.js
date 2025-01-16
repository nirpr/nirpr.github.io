
async function fetchGitHubProjects() {
    try {
        const username = 'nirpr';
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const projects = await response.json();

        const projectsContainer = document.getElementById('projects');
        
        const allowedProjects = [
            'Linux-FlightsAPI',
            'ML-Myocardial_Infarction',
            'Collaborative-Playlist-Manager',
            'Memory_game',
            'Amazon_reviews_classifier',
            'cloze_completion'
        ];
        
        const filteredProjects = projects
            .filter(project => allowedProjects.includes(project.name))
            .sort((a, b) => {
                return allowedProjects.indexOf(a.name) - allowedProjects.indexOf(b.name);
            });

        projectsContainer.innerHTML = '';

        filteredProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <h3>${project.name}</h3>
                <p>${project.description || 'No description available'}</p>
                <p>Language: ${project.language || 'Not specified'}</p>
                <a href="${project.html_url}" target="_blank">View on GitHub</a>
                <button onclick="fetchReadme('${project.name}')">View README</button>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

async function fetchReadme(repoName) {
    try {
        const response = await fetch(`https://api.github.com/repos/nirpr/${repoName}/readme`, {
            headers: { Accept: 'application/vnd.github.v3.raw' }
        });
        if (!response.ok) throw new Error('README not found');
        const readmeContent = await response.text();
        
        // Convert markdown to HTML using marked
        const htmlContent = marked.parse(readmeContent, {
            breaks: true,
            gfm: true
        });

        // Add some basic styling for the README content
        const styledContent = `
            <div style="color: #fff; line-height: 1.6;">
                ${htmlContent}
            </div>
        `;

        document.getElementById('readmeContent').innerHTML = styledContent;
        document.getElementById('readmeModal').style.display = 'block';
    } catch (error) {
        document.getElementById('readmeContent').innerHTML = `<p>Error loading README: ${error.message}</p>`;
        document.getElementById('readmeModal').style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('readmeModal').style.display = 'none';
}

fetchGitHubProjects();
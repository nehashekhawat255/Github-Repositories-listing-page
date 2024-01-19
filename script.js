// script.js

document.addEventListener('DOMContentLoaded', function () {
    const loader = document.getElementById('loader');
    const userProfile = document.getElementById('userProfile');
    const reposContainer = document.getElementById('repos');
    const paginationContainer = document.getElementById('pagination');
    const usernameInput = document.getElementById('usernameInput');

    // Replace 'YOUR_USERNAME' with the GitHub username you want to fetch data for
    let username = 'johnpapa';
    const perPage = 10;
    let currentPage = 1;

    // Fetch user data from GitHub API
    function fetchUserData() {
        fetch(`https://api.github.com/users/${username}`)
            .then(response => response.json())
            .then(user => {
                loader.style.display = 'none'; // Hide loader

                userProfile.innerHTML = `
                    <img src="${user.avatar_url}" alt="${user.login} profile picture">
                    <h2>${user.name || user.login}</h2>
                    <p>${user.bio || ''}</p>
                    <p>${user.location ? `<span class="location-sticker">${user.location}</span>` : ''}</p>
                    <p><a href="${user.html_url}" target="_blank">Visit GitHub Profile</a></p>
                `;
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                userProfile.innerHTML = '<p>Error fetching user data</p>';
            });
    }

    // Fetch repositories data from GitHub API
    function fetchRepositories(page) {
        fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`)
            .then(response => response.json())
            .then(repos => {
                reposContainer.innerHTML = '';
                repos.forEach(repo => {
                    const repoElement = document.createElement('div');
                    repoElement.classList.add('repo-card');
                    repoElement.innerHTML = `
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="repo-languages">${repo.language ? `<span>${repo.language}</span>` : ''}</div>
                        <p>Stars: ${repo.stargazers_count}</p>
                        <a href="${repo.html_url}" target="_blank">Visit Repository</a>
                    `;
                    reposContainer.appendChild(repoElement);
                });

                updatePagination(repos.length > 0);
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                reposContainer.innerHTML = '<p>Error fetching repositories</p>';
            });
    }

    function updatePagination(hasNextPage) {
        paginationContainer.innerHTML = '';

        const totalPages = Math.ceil(perPage / currentPage);
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.addEventListener('click', () => {
                currentPage = i;
                fetchRepositories(currentPage);
                updatePagination(true);
            });
            paginationContainer.appendChild(button);
        }
    }
    // Search repositories based on the entered username
    window.searchRepositories = function () {
        const inputUsername = usernameInput.value.trim();
        if (inputUsername) {
            username = inputUsername;
            fetchUserData();
            fetchRepositories(currentPage);
            updatePagination(true);
        } else {
            alert('Please enter a GitHub username.');
        }
    };

    // Initial fetch
    fetchUserData();
    fetchRepositories(currentPage);
    updatePagination(true);
});

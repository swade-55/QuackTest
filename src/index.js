class User {
  constructor(username,userId,email){
    this.username = username;
    this.userId = userId;
    this.email = email;
  }
}

class QuackApi {
  constructor() {
    this.addQuack = false;
    this.user = null;
    console.log('QuackApi instance created.');
  }



  async fetchQuacks() {
    try {
      const response = await fetch('http://localhost:3000/quacks/quacks');
      const quacks = await response.json();
      const reversedQuacks = quacks.reverse(); 
      this.renderQuacks(reversedQuacks);
    } catch (error) {
      console.error("Error fetching quacks:", error);
    }
  }

  renderQuacks(quacks) {
    const quackCollection = document.getElementById('quack-collection');
    quackCollection.innerHTML = ''; // Clear existing quacks

    quacks.forEach(quack => {
      // Create a div for each quack
      const quackDiv = document.createElement('div');
      quackDiv.classList.add('quack-element'); 
      // Populate the quack information
      quackDiv.innerHTML = `
      <div class="quack-post-form">
        <div class="post-header">
          <h3 class="quack-name">${quack.name}</h3>
          <div class="dropdown">
            <button class="dropbtn">&#8942;</button>
            <div class="dropdown-content">
              <a href="#" class="delete-button">Delete</a>
            </div>
         </div>
        </div>  
        <p class="quack-content">${quack.postContent}</p>
  
        <div id="post-footer">
          <!-- Like Button as Heart -->
          <button class="heart-button">
            <i class="far fa-heart heart-icon"></i>
          </button>

          <p class="quack-likes">${quack.likeCount}</p>
    
          <!-- Comment Button -->
          <button class="comment-button">
            <i class="far fa-comment comment-icon"></i>
          </button>
        </div>
  
        <!-- Comment Section -->
        <div id="comment-section-${quack._id}" class="comment-section">
          <input type="text" class="comment-input" placeholder="Add a comment">
          <button id="addquack_button" class="send-comment-button">Send</button>
        
          <!-- List of Comments -->
          <ul class="comment-list" id="comment-list-${quack._id}"></ul>
        </div>
      </div>
      `;

      const commentList = quackDiv.querySelector(`#comment-list-${quack._id}`);
      quack.comments.forEach(comment => {
        const commentItem = document.createElement('li');
        commentItem.textContent = comment;
        commentList.appendChild(commentItem);
      });

      //incriment likes
      const likeButton = quackDiv.querySelector('.heart-button');
      likeButton.addEventListener('click', () => {
        this.incrementLikes(quack._id);
      });

      //delete post
      const deleteButton = quackDiv.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => {
        console.log('Delete button clicked for quackId:', quack._id);
        this.deleteQuack(quack._id);
      })

      //toggle the comment section
      const commentButton = quackDiv.querySelector('.comment-button');
      commentButton.addEventListener('click', () => {
        const commentSection = document.getElementById(`comment-section-${quack._id}`);
        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
      })

      //function to add comment on click of button
      const sendCommentButton = quackDiv.querySelector('.send-comment-button');
      sendCommentButton.addEventListener('click', () => {
        const commentInput = document.querySelector(`#comment-section-${quack._id} .comment-input`);
        const commentValue = commentInput.value;
        console.log('adding comment: ', commentValue);
        this.addComment(quack._id, commentValue);
      })

      quackCollection.appendChild(quackDiv);
    });
  }

  async loginUser(email, password) { 
    console.log('loginUser method called.'); 
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Login successful:", result);
        // Handle post-login logic 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error during login');
      }
    } catch (error) {
      console.error("Error logging in user:", error);
    }
  }
  


  async addNewQuack(quackObject) {
    try {
      //newQuack object
      const newQuack = {
        name: quackObject.name,
        postContent: quackObject.quackText, 
        likeCount: 0, 
        comments: []
      };
    
  
      // Make the POST request to the server
      const response = await fetch('http://localhost:3000/quacks/quacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuack)
      });
  
      if (response.ok) {
        await response.json();
  
        // Re-fetch all quacks to refresh the list
        await this.fetchQuacks();
        await this.fetchTopQuacks();
        //force refresh of page
        window.location.reload();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred while adding the quack.');
      }
    } catch (error) {
      console.error("Error adding new quack:", error);
    }
  }

  
  

  async fetchTopQuacks() {
    try {
      const response = await fetch('http://localhost:3000/quacks/top-quacks');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const topQuacks = await response.json();
  
      console.log("Top quacks data:", topQuacks);
  
      // Check if the response is an array before calling forEach
      if (Array.isArray(topQuacks)) {
        this.renderTopQuacks(topQuacks);
      } else {
        console.error("Received data is not an array:", topQuacks);
      }
    } catch (error) {
      console.error("Error fetching top quacks:", error);
    }
  }



  async deleteQuack(quackId) {
    try {
      const response = await fetch(`http://localhost:3000/quacks/delete-quack?id=${quackId}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        await this.fetchQuacks(); // Refresh the quack list
      } else {
        throw new Error('Error deleting quack');
      }
    } catch (error) {
      console.error("Error deleting quack:", error);
    }
  }

  async incrementLikes(quackId) {
    try {
      const response = await fetch(`http://localhost:3000/quacks/increment-likes?id=${quackId}`, {
        method: 'POST'
      });

      if (response.ok) {
        await this.fetchQuacks(); // Refresh the quack list
      } else {
        throw new Error('Error incrementing likes');
      }
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  }

  async addComment(quackId, comment) {
    try {
      const response = await fetch('http://localhost:3000/quacks/add-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quackId, comment })
      });

      if (response.ok) {
        await this.fetchQuacks(); // Refresh the quack list
      } else {
        throw new Error('Error adding comment');
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
  
  
  renderTopQuacks(quacks) {
    const topQuacksDiv = document.getElementById('top-quacks');
    // Clear existing content
    topQuacksDiv.innerHTML = '<h1 id="top-quack-title">Top Quacks For You</h1>';
    
    quacks.forEach(quack => {
      const quackDiv = document.createElement('div');
      // Add quack details
      quackDiv.innerHTML = `<h3>${quack.name}</h3><p>${quack.postContent}</p><p>Likes: ${quack.likeCount}</p>`;
      topQuacksDiv.appendChild(quackDiv);
    });
  }

  displayuserInfo(username) {
    document.getElementById('user-name').textContent = username;
  }

  init() {
    const jsonString = localStorage.getItem('user');
    const userjson = JSON.parse(jsonString);

    const userobj = new User(userjson.username, userjson.id, userjson.email);
    this.user = userobj;
    console.log(this.user);
    this.displayuserInfo(this.user.username);
    this.fetchQuacks();
    this.fetchTopQuacks();
  }
}

const quackApi = new QuackApi();
document.addEventListener("DOMContentLoaded", () => {
quackApi.init()

const addQuackForm = document.querySelector('.add-quack-form');
  if (addQuackForm) {
    addQuackForm.style.display = 'block'; // This will make sure the form is visible
    addQuackForm.addEventListener('submit', async function(event) {
      event.preventDefault(); // This prevents the default form submission
      const name = quackApi.user.username;
      const quackText = this.quackText.value;
      if(name && quackText) {
        await quackApi.addNewQuack({ name, quackText });
      }
    });
}
}
);

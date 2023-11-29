import tkinter as tk
from tkinter import scrolledtext
import requests

class QuackClientApp:
    def __init__(self, root):
        self.root = root
        root.title("Quack Client")

        # Username input
        self.username_label = tk.Label(root, text="Username")
        self.username_label.pack()
        self.username_entry = tk.Entry(root)
        self.username_entry.pack()

        # Quack content input
        self.quack_label = tk.Label(root, text="What's Quackin?")
        self.quack_label.pack()
        self.quack_entry = scrolledtext.ScrolledText(root, wrap=tk.WORD, height=5)
        self.quack_entry.pack()

        # Submit button
        self.submit_button = tk.Button(root, text="Quack", command=self.submit_quack)
        self.submit_button.pack()

        # Quack display area
        self.quack_display = scrolledtext.ScrolledText(root, wrap=tk.WORD, height=10)
        self.quack_display.pack()
        self.refresh_quacks()

    def submit_quack(self):
        username = self.username_entry.get()
        quack_content = self.quack_entry.get("1.0", tk.END)
        quack_data = {
            'name': username,
            'postContent': quack_content.strip(),
            'likeCount': 0,  # Defaulting like count to 0
            'comments': []   # Defaulting comments to an empty list
        }
        response = requests.post('http://localhost:3000/quacks', json=quack_data)
        if response.status_code == 201:
            self.refresh_quacks()
        else:
            print("Error posting quack")

    def refresh_quacks(self):
        response = requests.get('http://localhost:3000/quacks')
        if response.status_code == 200:
            quacks = response.json()
            self.quack_display.delete('1.0', tk.END)  # Clear existing content
            for quack in quacks:
                name = quack.get('name', 'Unknown User')  # Default to 'Unknown User' if 'name' is not found
                post_content = quack.get('postContent', 'No Content')  # Default to 'No Content' if 'postContent' is not found
                like_count = quack.get('likeCount', 0)  # Default to 0 if 'likeCount' is not found
                display_text = f"{name}:\n{post_content}\nLikes: {like_count}\n\n"
                self.quack_display.insert(tk.END, display_text)
        else:
            print("Error fetching quacks: ", response.status_code)


root = tk.Tk()
app = QuackClientApp(root)
root.mainloop()

import tkinter as tk
from tkinter import scrolledtext, messagebox, simpledialog
import requests

class QuackClientApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Quack Client - Login or Sign Up")
        self.initialize_login_frame()
        self.initialize_signup_frame()

    def initialize_login_frame(self):
        self.login_frame = tk.Frame(self.root)
        # Email
        self.email_label = tk.Label(self.login_frame, text="Email")
        self.email_label.pack()
        self.email_entry = tk.Entry(self.login_frame)
        self.email_entry.pack()
        # Password
        self.password_label = tk.Label(self.login_frame, text="Password")
        self.password_label.pack()
        self.password_entry = tk.Entry(self.login_frame, show="*")
        self.password_entry.pack()
        # Login Button
        self.login_button = tk.Button(self.login_frame, text="Login", command=self.login)
        self.login_button.pack()
        # Switch to Signup
        self.to_signup_button = tk.Button(self.login_frame, text="Sign Up", command=self.show_signup)
        self.to_signup_button.pack()
        self.login_frame.pack()

    def initialize_signup_frame(self):
        self.signup_frame = tk.Frame(self.root)
        # Username
        self.signup_username_label = tk.Label(self.signup_frame, text="Username")
        self.signup_username_label.pack()
        self.signup_username_entry = tk.Entry(self.signup_frame)
        self.signup_username_entry.pack()
        # Email
        self.signup_email_label = tk.Label(self.signup_frame, text="Email")
        self.signup_email_label.pack()
        self.signup_email_entry = tk.Entry(self.signup_frame)
        self.signup_email_entry.pack()
        # Password
        self.signup_password_label = tk.Label(self.signup_frame, text="Password")
        self.signup_password_label.pack()
        self.signup_password_entry = tk.Entry(self.signup_frame, show="*")
        self.signup_password_entry.pack()
        # Signup Button
        self.signup_button = tk.Button(self.signup_frame, text="Sign Up", command=self.signup)
        self.signup_button.pack()
        # Back to Login
        self.to_login_button = tk.Button(self.signup_frame, text="Back to Login", command=self.show_login)
        self.to_login_button.pack()

    def show_signup(self):
        self.login_frame.pack_forget()
        self.signup_frame.pack()

    def show_login(self):
        self.signup_frame.pack_forget()
        self.login_frame.pack()

    def signup(self):
        username = self.signup_username_entry.get()
        email = self.signup_email_entry.get()
        password = self.signup_password_entry.get()
        if not username or not email or not password:
            messagebox.showerror("Error", "All fields are required for signup")
            return

        response = requests.post('http://localhost:3000/user/register', json={'username': username, 'email': email, 'password': password})
        if response.status_code == 201:
            messagebox.showinfo("Success", "Signup successful. You can now login.")
            self.show_login()
        else:
            messagebox.showerror("Signup failed", "Could not register user")
            
    def show_top_quacks(self):
        response = requests.get('http://localhost:3000/quacks/top-quacks')
        if response.status_code == 200:
            top_quacks = response.json()
            self.quack_display.delete('1.0', tk.END)
            for quack in top_quacks:
                quack_id = quack.get('_id')
                display_text = f"Top Quack! {quack.get('name', 'Unknown User')}:\n{quack.get('postContent', 'No Content')}\nLikes: {quack.get('likeCount', 0)}\n"
                self.quack_display.insert(tk.END, display_text)
                self.add_quack_buttons(quack_id)
            self.quack_display.insert(tk.END, "\n")
        else:
            messagebox.showerror("Error", "Failed to fetch top quacks")

    def login(self):
        email = self.email_entry.get()
        password = self.password_entry.get()
        if not email or not password:
            messagebox.showerror("Error", "Email and password are required")
            return

        response = requests.post('http://localhost:3000/user/login', json={'email': email, 'password': password})
        if response.status_code == 200:
            self.login_frame.pack_forget()
            self.init_main_app()
        else:
            messagebox.showerror("Login failed", "Invalid email or password")

    def init_main_app(self):
        self.root.title("Quack Client")
        # Quack Entry
        self.quack_label = tk.Label(self.root, text="What's Quackin?")
        self.quack_label.pack()
        self.quack_entry = scrolledtext.ScrolledText(self.root, wrap=tk.WORD, height=5)
        self.quack_entry.pack()
        # Submit Button
        self.submit_button = tk.Button(self.root, text="Quack", command=self.submit_quack)
        self.submit_button.pack()
        # Logout Button
        self.logout_button = tk.Button(self.root, text="Logout", command=self.logout)
        self.logout_button.pack()
        # Quack Display
        self.quack_display = scrolledtext.ScrolledText(self.root, wrap=tk.WORD, height=10)
        self.quack_display.pack()
        # Button to fetch top 5 quacks
        self.top_quacks_button = tk.Button(self.root, text="Top 5 Quacks", command=self.show_top_quacks)
        self.top_quacks_button.pack()
        self.refresh_quacks()

    def submit_quack(self):
        quack_content = self.quack_entry.get("1.0", tk.END).strip()
        if not quack_content:
            messagebox.showerror("Error", "Quack content is required")
            return

        response = requests.post('http://localhost:3000/quacks/quacks', json={'postContent': quack_content})
        if response.status_code == 201:
            self.quack_entry.delete('1.0', tk.END)
            self.refresh_quacks()
        else:
            messagebox.showerror("Error", "Failed to post quack")

    def refresh_quacks(self):
        response = requests.get('http://localhost:3000/quacks/quacks')
        if response.status_code == 200:
            quacks = response.json()
            self.quack_display.delete('1.0', tk.END)
            for quack in quacks:
                display_text = f"{quack.get('name', 'Unknown User')}:\n{quack.get('postContent', 'No Content')}\nLikes: {quack.get('likeCount', 0)}\n\n"
                self.quack_display.insert(tk.END, display_text)
        else:
            messagebox.showerror("Error", "Failed to fetch quacks")
            
    def refresh_quacks(self):
        response = requests.get('http://localhost:3000/quacks/quacks')
        if response.status_code == 200:
            quacks = response.json()
            self.quack_display.delete('1.0', tk.END)
            for quack in quacks:
                quack_id = quack.get('_id')  # Assuming each quack has a unique '_id'
                display_text = f"{quack.get('name', 'Unknown User')}:\n{quack.get('postContent', 'No Content')}\nLikes: {quack.get('likeCount', 0)}\n"
                self.quack_display.insert(tk.END, display_text)
                self.add_quack_buttons(quack_id)
            self.quack_display.insert(tk.END, "\n")
        else:
            messagebox.showerror("Error", "Failed to fetch quacks")

    def add_quack_buttons(self, quack_id):
        like_button = tk.Button(self.root, text="Like", command=lambda: self.increment_like(quack_id))
        delete_button = tk.Button(self.root, text="Delete", command=lambda: self.delete_quack(quack_id))
        comment_button = tk.Button(self.root, text="Comment", command=lambda: self.add_comment(quack_id))

        self.quack_display.window_create(tk.END, window=like_button)
        self.quack_display.window_create(tk.END, window=delete_button)
        self.quack_display.window_create(tk.END, window=comment_button)
        self.quack_display.insert(tk.END, "\n\n")

    def increment_like(self, quack_id):
        response = requests.post(f'http://localhost:3000/quacks/increment-likes?id={quack_id}')
        if response.status_code == 200:
            self.refresh_quacks()
        else:
            messagebox.showerror("Error", "Failed to increment like")

    def delete_quack(self, quack_id):
        response = requests.delete(f'http://localhost:3000/quacks/delete-quack?id={quack_id}')
        if response.status_code == 204:
            self.refresh_quacks()
        else:
            messagebox.showerror("Error", "Failed to delete quack")

    def add_comment(self, quack_id):
        comment = simpledialog.askstring("Add Comment", "Enter your comment:")
        if comment:
            response = requests.post('http://localhost:3000/quacks/add-comment', json={'quackId': quack_id, 'comment': comment})
            if response.status_code == 201:
                messagebox.showinfo("Success", "Comment added successfully")
            else:
                messagebox.showerror("Error", "Failed to add comment")

    def logout(self):
        self.root.title("Quack Client - Login or Sign Up")
        for widget in self.root.winfo_children():
            widget.destroy()
        self.__init__(self.root)

def main():
    root = tk.Tk()
    app = QuackClientApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()

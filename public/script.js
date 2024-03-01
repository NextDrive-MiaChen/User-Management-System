document.getElementById('addUserForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 防止表單自動提交

    const name = document.getElementById('name').value;
    const nickname = document.getElementById('nickname').value;
    const age = document.getElementById('age').value;

    const response = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, nickname, age })
    });

    if (response.ok) {
        const data = await response.json();
        alert(`New user added with ID: ${data.id}`);
   
        document.getElementById('name').value = '';
        document.getElementById('nickname').value = '';
        document.getElementById('age').value = '';
      
        loadUserList();
    } else {
        alert('Failed to add user');
    }
});

// 加載使用者清單
async function loadUserList() {
    const response = await fetch('/users');
    const userList = await response.json();

    document.getElementById('userListTableBody').innerHTML = '';

    userList.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.nickname}</td>
            <td>${user.age}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button></td>
        `;
        document.getElementById('userListTableBody').appendChild(tr);
    });
}

// 刪除使用者
async function deleteUser(userId) {
    const response = await fetch(`/users/${userId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert('User deleted successfully');
        loadUserList();
    } else {
        alert('Failed to delete user');
    }
}

// 搜尋使用者
async function searchUser() {
    const userId = document.getElementById('searchUserId').value;
    const response = await fetch(`users/${userId}`);
    if (response.ok) {
        const user = await response.json();
        document.getElementById('searchUserInfo').innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Name</th>
                        <th scope="col">Nickname</th>
                        <th scope="col">Age</th>
                    </tr>
                </thead>
                <tbody>
   
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.nickname}</td>
                    <td>${user.age}</td>
                </tr>
        
                </tbody>
            </table>
        `;
    } else {
        document.getElementById('searchUserInfo').innerHTML = '<p>User not found</p>';
    }
}

loadUserList();
async function searchUser() {

    //document.getElementById('searchUserId').value = '';

    const searchTerm = document.getElementById('searchUserId').value;
    const response = await fetch(`/users?search=${searchTerm}`);
    if (response.ok) {
        const userList = await response.json();
        if (userList.length > 0) {
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
                        ${userList.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.nickname}</td>
                                <td>${user.age}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            document.getElementById('searchUserInfo').innerHTML = '<p>No users found</p>';
        }
    } else {
        document.getElementById('searchUserInfo').innerHTML = '<p>Error searching users</p>';
    }
}

async function searchUser() {
    const searchTerm = document.getElementById('searchUserId').value;
    const response = await fetch(`/users?search=${searchTerm}`);
    if (response.ok) {
        const userList = await response.json();
        if (userList.length > 0) {
            const tableBody = userList.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.nickname}</td>
                    <td>${user.age}</td>
                </tr>
            `).join('');
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
                        ${tableBody}
                    </tbody>
                </table>
            `;
        } else {
            document.getElementById('searchUserInfo').innerHTML = '<p>No users found</p>';
        }
    } else {
        document.getElementById('searchUserInfo').innerHTML = '<p>Error searching users</p>';
    }
}

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
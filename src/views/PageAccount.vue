<template>
    <div class="account-wrapper">
        <h2>Account</h2>
        <h4>Edit Account</h4>
        <form class="form">
            <div class="form-item">
                <label>Username</label>
                <input placeholder="Katemali25" />
            </div>
            <div class="form-item">
                <label>Password</label>
                <input type="password" placeholder="*******" />
            </div>
            <div class="form-item">
                <label>Email</label>
                <input type="email" placeholder="katemail.gmail.com" />
            </div>
            <div class="form-item">
                <label>First Name</label>
                <input placeholder="Katerina" />
            </div>
            <div class="form-item">
                <label>Last Name</label>
                <input placeholder="Malisova" />
            </div>
        </form>

        <div class="delete">Delete Account</div>
    </div>
</template>

<style scoped>
h4 {
    padding: 10px;
}

.account-wrapper {
    color: black;
}

input {
    border: 0px;
    border-radius: 100px;
    padding: 0 14px;
    position: relative;
    font-family: TwCen;
    font-size: 1.1vw;
    background-color: #F9FAFE;
    box-shadow: inset 2px 2px 4px #ebebeb,
        inset -2px -2px 4px #f6f6f6;
}

input::placeholder {
    font-family: TwCen;
    font-size: 1.1vw;
    color: rgb(177, 177, 177);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-item {
    height: 2.5em;
    line-height: 3em;
    width: 350px;
    display: flex;
    justify-content: flex-end;
    /* align-items: space-between; */
    /* background-color: blue; */
    text-align: right;
    gap: 30px;
}

.delete {
    background-color: rgb(214, 101, 101);
    color: white;
    width: 100px;
    padding: 10px;
    border-radius: 100px;
    margin-top: 80px;
    margin-bottom: 30px;
}
</style>
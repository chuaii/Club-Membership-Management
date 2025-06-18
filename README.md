# Club Membership Management System

## Introduction

This web application is a membership management system, associated with 4 roles
of users (Club Member, Membership Admin, Club Management User, System Admin)
to use and manage. Each type of users login will display a different window, respectively.

## Core Features

+ MEMBERS
    + **Club Member**
        + register an account
        + user login
        + lock account after 5 failure login
        + view and update profile
        + view and activate/renew membership
        + update password
        + request a membership card
        + receive and view notifications
        + membership renewal reminder
+ STAFFS
    + **Membership Admin**
        + help member user to create account
        + view both active and inactive member users
        + activate/deactivate membership status
        + view and update member users' profile
        + filter and search members by conditions
        + send group notifications
        + proceed membership cards requests
    + **Club Management User**
        + view membership fee audit history
        + view account status (new registered, expired, renewed)
        + filter target member users by given time range
    + **System Admin**
        + register a staff account
        + view and update staffs profile
        + update membership fee

## Frameworks and Tools

+ **Frontend**: React
+ **Backend**: Node.js (Express)
+ **Database**: MongoDB (by Azure Cosmos DB API)
+ **Tools**: WebStorm, Postman, React DevTools, Navicat

## How to Run ▶

**Clone**

+ Git command
    ```shell
    git clone https://github.com/chuaii/club-membership-management.git
    ```

**Run**

1. Make sure the configuration variable `port` must be the same (default: `12138`) in both
    + `/client/src/config.js`
    + `/server/.env`
2. Client Installation:
    ```shell
    cd client
    npm install
    npm start
    ```
3. Server Installation:
    ```shell
    cd server
    npm install
    npm start
    ```

## Preview GIFs

This application have several user roles:

+ System Admin
  ![](https://github.com/Chen-Huayi/pictures/blob/main/system_admin.gif)

+ Membership Admin
  ![](https://github.com/Chen-Huayi/pictures/blob/main/membership_admin.gif)

+ Club Member
  ![](https://github.com/Chen-Huayi/pictures/blob/main/member.gif)

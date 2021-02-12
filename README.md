# Minecraft Steve

## What does it do?

Minecraft Steve is a Discord Bot that can help manage a Discord Server or retrieve information on a Minecraft Server.

## Who made this?

Just me as of now.

## Why did you make this?

Well it's simple. I wanted a neat Discord bot that could check the status of my Minecraft Server and manage basic parts of my Discord server.

## How do I use it?

There are a plethora of commands for both server members and administrators, all of which begin with '**!**'.

### Universal Commands

- `!help`
  - Displays a menu of commands.
- `!status`
  - Displays information about a set Minecraft server.
- `!nick`
  - Changes a user's nickname.  
  *__Note:__ This does not work on the owner of the Discord server due to permission constraints.*
- `!poll [YN/2/3/4] [Title] [Options]`
  - Creates a poll for members to vote on.  
  *__Note:__ The title and each option should be separated by semicolons.*
- `!points`
  - Gets the member's points on that server.
- `!send [@User] [Value]`
  - Sends a member some points.
- `!gift` and its subcommands
  - `!gift all [Value]`
    - Give everyone (except you and bots) an even, clean portion of points.  
    *__Note:__ On large servers, a lot of points are required to give any to users.*
  - `!gift many [Value] [Users]`
    - Give some random users (who are not you or a bot) an even, clean portion of points.  
    *__Note:__ With large numbers of users, a lot of points are required to give any to them.*
  - `!gift one [Value] [Users]`
    - Give a random user (who is not you or a bot) some points.

### Administrator Commands

Administrators are those who have the correct roles, have an exception in the config, or are the owner of the server.

- `!clearchat [Value]`
  - Deletes a certain number preceding messages.
- `!ban [@User] [Reason]`
  - Bans a user from the server.
- `!unban [@User] [Reason]`
  - Unbans a user from the server.
- `!tempban [@User] [Time] [Reason]`
  - Temporarily bans a user from the server.  
  *__Note:__ See below for time formats.*
- `!kick [@User] [Reason]`
  - Removes a user from the server.
- `!mute [@User] [Reason]`
  - Mutes a user on the server.
- `!unmute [@User] [Reason]`
  - Unmutes a user on the server.
- `!tempmute [@User] [Time] [Reason]`
  - Temporarily mutes a user on the server.  
  *__Note:__ See below for time formats.*
- `!points [@User]` and its subcommands.
  - `!points [@User]`
    - Get a member's points.
  - `!points [@User] [add/remove/set] [Value]`
    - Change a member's points.
  - `!points [@User] reset`
    - Set a member's points to 0.
- `!config` and its subcommands.
  - `!config adminroles list`
    - List roles with permissions.
  - `!config adminroles [add/remove] [Role Name]`
    - Change roles with permissions.
  - `!points userexceptions list`
    - List users with permissions.
  - `!config userexceptions [add/remove] [@User]`
    - Change users with permissions.
  - `!config increment [Value]`
    - Change the amount of points awarded per message.
  - `!config bannedwords [add/remove] [Word]`
    - Change the words banned on the server.
  - `!config server [Address]`
    - Change the server `!status` retrieves information from.

### Time Formats

`[Amount][Time Unit]`

- Amount
  - A number
- Time unit
  - Defaults to milliseconds
  - `s`
    - Seconds
  - `m`
    - Minutes
  - `h`
    - Hours
  - `d`
    - Days
  - `w`
    - Weeks
  - `y`
    - Years

Examples: `3d`, `6h`, `10m`, `2w`, `1y`, `30s`, `75000`

*__Note:__ Times cannot be combined (i.e.* `1y2w3d4h5m6s` *or anything of that sort).*

## How do I add it to my server?

Here is a little forewarning before you add this bot. This bot is **rather buggy** and can crash for a number of reasons at any given moment. The bot might not also be fixed for hours at a time (school, sleep, etc.), but I will get to it as soon as I can (and when I notice). Thank you for your patience with this bot.

Click
[here](https://discord.com/api/oauth2/authorize?client_id=666061216782745638&permissions=8&scope=bot)
to add this bot to your server.

## To-Do

- [ ] Add a shop with roles and emoji
- [x] Add a gifting system
- [x] Clarify everything

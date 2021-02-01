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
  - Displays commands accessible to all users
- `!status`
  - Displays information about a set Minecraft server
- `!nick`
  - Changes a user's nickname  
  *__Note:__ This does not work with the owner of the Discord server due to permission constraints*
- `!poll [YN/2/3/4] [Title] [Options]`
  - Creates a poll for members to vote on  
  *__Note:__ The title and each option should be separated by semicolons*
- `!points`
  - Gets the member's points on that server
- `!send [@User] [Value]`
  - Sends a member some points

### Administrator Commands

Administrators are those who have the correct roles, have an exception in the config, or are the owner of the server.

- `!adminhelp`
  - Displays commands accessible to administrators
- `!clearchat [Value]`
  - Deletes a certain number preceding messages
- `!ban [@User] [Reason]`
  - Bans a user from the server
- `!unban [@User] [Reason]`
  - Unbans a user from the server
- `!kick [@User] [Reason]`
  - Removes a user from the server
- `!points [@User]` and its subcommands.
  - `!points [@User]`
    - Get a member's points
  - `!points [@User] [add/remove/set] [Value]`
    - Change a member's points
  - `!points [@User] reset`
    - Set a member's points to 0
- `!config` and its subcommands.
  - `!config adminroles list`
    - List roles with permissions
  - `!config adminroles [add/remove] [Role Name]`
    - Change roles with permissions
  - `!points userexceptions list`
    - List users with permissions
  - `!config userexceptions [add/remove] [@User]`
    - Change users with permissions
  - `!config increment [Value]`
    - Change the amount of points awarded per message
  - `!config bannedwords [add/remove] [Word]`
    - Change the words banned on the server
  - `!config server [Address]`
    - Change the server `!status` retrieves information from

## How do I add it to my server?

<!--You kinda can't. I haven't made the bot public yet (nor have I made this repo public), so its inaccessable for anyone but me. However, you can ask me and I will likely add it to your server (just be aware that the bot will be up and down due to the bot running off a raspberry pi in my basement).-->

Here is a little forewarning before you add this bot. This bot is **rather buggy** and can crash for a number of reasons at any given moment. The bot might not also be fixed for hours at a time (school, sleep, etc.), but I will get to it as soon as I can (and when I notice). Thank you for your patience with this bot.

Click
[here](https://discord.com/api/oauth2/authorize?client_id=666061216782745638&permissions=8&scope=bot)
to add this bot to your server.

## To-Do

- [ ] Add a shop with roles and emoji
- [ ] Add a gifting system
- [x] Clarify everything

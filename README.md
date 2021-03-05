# Minecraft Steve

## What does it do?

Minecraft Steve is a Discord Bot that can help manage a Discord Server or retrieve information on a Minecraft Server.

## Who made this?

Just me as of now.

## Why did you make this?

Well it's simple. I wanted a neat Discord bot that could check the status of my Minecraft Server and manage basic parts of my Discord server.

## How do I use it?

There are a plethora of commands for both server members and administrators, all of which begin with a set prefix (default: `!`).

### Universal Commands

- `help`
  - Displays a menu of commands.
- `status`
  - Displays information about a set Minecraft server.
- `nick`
  - Changes a user's nickname.  
  *__Note:__ This does not work on the owner of the Discord server due to permission constraints.*
- `poll [YN/2/3/4] [Title] [Options]`
  - Creates a poll for members to vote on.  
  *__Note:__ The title and each option should be separated by semicolons.*
- `wallet`
  - View the wallet
- `bank` and its subcommands.
  - `bank`
    - View the wallet and the bank.
  - `bank deposit [Amount]`
    - Deposit from the wallet into the bank.
  - `bank withdraw [Amount]`
    - Withdraw from the bank into the wallet.
- `beg [@User] [Amount]`
  - Asks a member for some money.
- `give [@User] [Amount]`
  - Sends a member some money.
- `give [Number] [Amount]`
  - Sends some members some money.
- `give all [Amount]`
  - Sends every member some money.

### Administrator Commands

Administrators are those who have the correct roles, have an exception in the config, or are the owner of the server.

- `clearchat [Value]`
  - Deletes a certain number preceding messages.
- `ban [@User] [Reason]`
  - Bans a user from the server.
- `unban [@User] [Reason]`
  - Unbans a user from the server.
- `tempban [@User] [Time] [Reason]`
  - Temporarily bans a user from the server.  
- `kick [@User] [Reason]`
  - Removes a user from the server.
- `mute [@User] [Reason]`
  - Mutes a user on the server.
- `unmute [@User] [Reason]`
  - Unmutes a user on the server.
- `tempmute [@User] [Time] [Reason]`
  - Temporarily mutes a user on the server.  
- `wallet [@User]` and its subcommands.
  - `wallet [@User]`
    - Get a member's wallet.
  - `wallet [@User] [give/take/set] [Amount]`
    - Add to or remove from a member's qallet.
- `bank [@User]` and its subcommands.
  - `bank [@User]`
    - Get a member's wallet and bank.
  - `bank [@User] [give/take/set] [Amount]`
    - Add to or remove from a member's bank.
- `config` and its subcommands.
  - `config adminroles list`
    - List roles with permissions.
  - `config adminroles [add/remove] [@Role]`
    - Change roles with permissions.
  - `config userexceptions list`
    - List users with permissions.
  - `config userexceptions [add/remove] [@User]`
    - Change users with permissions.
  - `config increment [Value]`
    - Change the amount of money awarded per message.
  - `config prefix [Prefix]`
    - Change the prefix the bot uses to check for commands.  
    *__Note:__ This can be multiple characters, but it works best with one or two.*
  - `config currency name [Name]`
    - Change the name of the currency.
  - `config currency symbol [Symbol]`
    - Change the symbol of the currency.  
    *__Note:__ This can be multiple characters, but it works best with one or two.*
  - `config bannedwords [add/remove] [Word]`
    - Change the words banned on the server.
  - `config server [Address]`
    - Change the server `status` retrieves information from.

### Money Formats

`[Amount]`

- Amount
  - A number >= 0
  - Can have a decimal (will be rounded up to two decimal places)
  - Can be `xey` (`x*10^y`)
  - Is not too large (i.e. above Javascript safe number limit = `9007199254740991` = `2^53 - 1`)  
  *__Note:__ This still might work, but it is suggested to keep numbers below that (hence, 'safe').*

Examples: `100`, `5e12` = `5000000000000`, `7.49`, `0.000000000000001` = `0.01`, `4.7e3` (`4700`)

### Time Formats

`[Amount][Time Unit]`

- Amount
  - A number
- Time unit
  - Defaults to milliseconds
  - `s` = Seconds
  - `m` = Minutes
  - `h` = Hours
  - `d` = Days
  - `w` = Weeks
  - `y` = Years

Examples: `3d`, `6h`, `10m`, `2w`, `1y`, `30s`, `75000`

*__Note:__ Times cannot be combined (i.e.* `1y2w3d4h5m6s` *or anything of that sort).*

## How do I add it to my server?

Here is a little forewarning before you add this bot. This bot is **rather buggy** and can crash for a number of reasons at any given moment. The bot might not also be fixed for hours at a time (school, sleep, etc.), but I will get to it as soon as I can (and when I notice). Thank you for your patience with this bot.

Click
[here](https://discord.com/api/oauth2/authorize?client_id=666061216782745638&permissions=8&scope=bot)
to add this bot to your server.

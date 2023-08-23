# GitHub Issue Tracker Project: Lessons Learned

### August 2023

I recently came across a job posting that advertised one possible take-home exercise: a GitHub issue tracker. I thought that was a cool project, and I had never worked with the GitHub API before.

# Seeding the repos & issues

Before creating an issue tracking UI, I wanted to have a bunch of issues to track (and I didn't want to create them all by hand). TL;DR - here is the final [shell script](https://github.com/aaronparisi/railway-gh-issue-tracker/blob/main/seedRailwayRepos.sh).

To house these repos and issues, I created a new GitHub user, [railway-aaron-parisi](https://github.com/railway-aaron-parisi).

My initial thought was to utilize the `create` subcommands for the GitHub CLI's [repo](https://cli.github.com/manual/gh_repo_create) and [issue](https://cli.github.com/manual/gh_issue_create) commands. Plan was to simply do a few loops in a shell script:

```bash
for x in {1..10}; do
  # create repo $x

  for y in {1..10}; do
    # create issue $y
  done
done
```

However, `gh issue create` was bumping me into `GraphQL` rate limits.

My initial thought then was to monitor the rate limit status:

```bash
threshold=100
response=$(gh api -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" /rate_limit) # this does not contribute to rate limits
remaining=$(echo "$response" | jq -r '.resources.graphql.remaining')
reset_timestamp=$(echo "$response" | jq -r '.resources.graphql.reset')
current_timestamp=$(date +%s)
time_until_reset=$((reset_timestamp - current_timestamp))

if ((remaining <= threshold)); then
  echo "sleeping..."
  sleep "$time_until_reset"
  echo "... done sleeping"
fi
```

I found, however, that I was still exceeding a `GraphQL` rate limit - despite having quite a bit `remaining`. [This](https://github.com/cli/cli/discussions/6826) issue discusses a secondary rate limit for `GraphQL` requests, and [these](https://docs.github.com/en/graphql/overview/resource-limitations#rate-limit) docs indidate that the `GraphQL` rate limit is different than the REST API's rate limits, since a "single complex GraphQL call could be the equivalent of thousands of REST requests."

[This](https://github.com/cli/cli/issues/4774) issue indicates that a batch issue creation tool will not be made, and [this](https://github.com/cli/cli/issues/4801) issue further discusses rate limits and the information (or lack thereof) in API response headers.

Despite adding some `sleep` statements, I was still hitting `GraphQL` rate limits as I tried to create 10 issues for each of 10 repos. One option would be to just admit that this is a toy app and increase the `sleep` duration or decrease the number of issues per repo, but I didn't want to do that.

My next thought was to try to avoid `GrpahQL` entirely by calling the [REST API Endpoint](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue) directly:

```bash
    issue_res=$(gh api /repos/$github_user/repo$x/issues \
      -F title="Issue No. $y" \
      -F body="blah blah blah" \
      -F assignee="$github_user" \
      -F labels=$selected_labels_string \
      -H "Accept: application/vnd.github+json" \
      -H "X-GitHub-Api-Version: 2022-11-28"
    )
```

where `selected_labels_string` is a random collection of comma-separated labels. The problem here is that, while `gh issue create` accepts a _string_ argument for its `-l` flag, `gh api -F labels=[...]` takes an _array_. I'm no `bash` wiz, and I couldn't figure out how to pass the labels. Attempts included:

```bash
    labels_json=$(printf '"%s"\n' "${labels[@]}" | jq -s .)
    echo $labels_json
```

The example provided by the [Create an Issue Docs](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue) utilized the `-d` flag as follows:

```bash
curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO/issues \
  -d '{"title":"Found a bug","body":"I'\''m having a problem with this.","assignees":["octocat"],"milestone":1,"labels":["bug"]}'
```

However, [gh api](https://cli.github.com/manual/gh_api) does not accept a `-d` flag.

So my next thought was to just forego the `gh` CLI altogether and make API requests directly with `curl`... but at that point I wondered why I didn't just use JavaScript, which I'm more familiar with.

One additional note: the `curl` command prints the http response headers when the `-i` flag is provided. I was under the imporession that extracting the headers and the body into separate variables would be trivial, but [this](https://dille.name/blog/2021/09/13/processing-response-headers-and-body-at-once-using-curl/) and [this](https://stackoverflow.com/questions/25852524/get-both-the-headers-and-the-body-of-a-curl-response-in-two-separated-variables) suggest otherwise.

ChatGPT to the rescue though - after a number of iterations, it provided the following lines, which did what I wanted:

```bash
headers=$(echo "$response" | awk 'BEGIN{RS="\r\n\r\n"} NR==1')
body=$(echo "$response" | awk 'BEGIN{RS="\r\n\r\n"} NR>1')
```

In any event, calling the API endpoint directly did not allow me to bypass rate limits (although perhaps I exceeded a _different_ rate limit):

```JSON
body: {
  "message": "You have exceeded a secondary rate limit and have been temporarily blocked from content creation. Please retry your request again later.",
  "documentation_url": "https://docs.github.com/rest/overview/resources-in-the-rest-api#secondary-rate-limits"
}
```

# Multiple GitHub Usesrs

As I was messing around with the secondary GitHub account I made for this project, I wanted to be able to push to / pull from both my main user's and this secondary user's repositories. This wasn't too-too difficult to figure out ([article](https://gist.github.com/oanhnn/80a89405ab9023894df7)) but I was somewhat dissatisfied that I had to modify the remote url for repos belonging to the secondary account (`git@my-secondary-github:my-secondary-username/some-repo.git`). But in any event it's always good practice to have to make new SSH keys.

# Getting the Data

I know about [GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps) but I wasn't sure initially whether this would be a good use case for them (I'm pretty sure it is, TBD). In any event, I wanted a way to fetch the user's repos and issues without exposing any user information client-side. Avoiding GitHub Apps and Oauth for now, I just made a simple Express server that pulled the user's authorization token from an environment variable - which I can set in [Heroku](https://devcenter.heroku.com/articles/config-vars).

The Express server used [dotenv](https://github.com/motdotla/dotenv) and [cors middleware](https://expressjs.com/en/resources/middleware/cors.html), but it is quite [straightforward](https://github.com/aaronparisi/railway-backend/blob/main/index.js).

# React Frontend

The client-side code is a [React application](https://github.com/aaronparisi/railway-gh-issue-tracker) that's simple enough - a header, a sidebar showing a list of repos, and a main panel showing the issues for the selected repository. Some stuff I reflected on:

- Should I return _all_ data (every repository, every issue for every repository) from a single API endpoint? Will there be significant delays in before any data is rendered?
- I decided against this - so issue data would be fetched 1 repository at a time, at the time of repository selection. Which component should contain the issue-fetching logic?
- I ended up putting it in `App` itself, rather than in the component displaying the issues. I don't see a reason why the component _rendering_ the issues has to be responsible for _obtaining_ the issues, it can simply be a recipient of data that the App itself manages. Conceptual argument aside, I was able to avoid passing a few extra props.

# TODOs

- All the standard type of stuff: sorting, filtering, better styling
- Read further about GitHub apps - I think I could set something up where any user could retrive data for any account they had credentials for, as opposed to the single user account my server is hard-coded to interact with.
- JIRA-like functionality: close / reopen issues from my app, reassign issues, polling updates

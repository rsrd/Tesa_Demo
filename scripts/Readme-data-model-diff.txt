data-model-diff.sh is a small script to get files modified between specific commits.

This is required, when we want to perform delta data model load on an instance.

How to use the script
1. Open Git Bash
2. Navigate to location when data-model-diff.sh is located
3. From sample data repo in GitHub, navigate to Commits and copy from & to SHA of commits from where you want the difference to be loaded
4. Execute script with appropriate parameters
    Syntax: ./data-model-diff.sh "source path for sampledata" "Branch name" "folder name" "from checksum" "to checksum"
    Example: ./data-model-diff.sh /d/RS/Git/dataplatform-sampledata/ master jcp-v4 71a6a50c4 fe52616
5. Script will create a folder (<folder name provided in parameter>-patch) in root directory of sampledata
6. All sub folders and scripts which are modified between commit details provided, will be stored in patch folder
7. Now it's regular process for loading data model

What does script do internally?
1. Script will pull latest code from GitHub
2. Will checkout specified branch in parameter
3. Pull the latest code
4. Delete old patch folder
5. Create new patch folder & copy files

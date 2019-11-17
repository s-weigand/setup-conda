
#!/bin/bash
$HOME/miniconda/bin/conda init bash

if [ -e ~/.bash_profile ]
then
  echo "running source ~/.bash_profile"
  source ~/.bash_profile
fi

if [ -e ~/.bashrc ]
then
  echo "running source ~/.bashrc"
  source ~/.bashrc
fi


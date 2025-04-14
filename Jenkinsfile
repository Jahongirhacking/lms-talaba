pipeline {
    agent any
    
    stages {
        stage('my_edu update') {
            steps {
                sh 'ansible-playbook /var/lib/jenkins/ansible/my_hemis.yml -l my_hemis'
            }
        }
    }
}

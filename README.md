# kubernates-assignment
This Nodejs application is deployed on AWS Elastic Kubernates Service

The AWS EKS service is created using ekctl command.


### Login into ECR public repository
```
[ec2-user@ip-172-31-43-105 ~]$ aws ecr-public get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin public.ecr.aws/p6z1k1w3
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```

### Build Docker image
Change directory into nodeapp and execute the below command to run the docker image.
```
sudo docker build -t nodeapp:1.0 .
```
### Verify docker images
```
[ec2-user@ip-172-31-43-105 ~]$ sudo docker images
REPOSITORY                           TAG         IMAGE ID       CREATED        SIZE
public.ecr.aws/p6z1k1w3/nodeapp      1.0         a485cec7d6f6   40 hours ago   114MB
nodeapp                              1.0         a485cec7d6f6   40 hours ago   114MB
node                                 16-alpine   b1ca7421d2e7   6 days ago     112MB
```

### Tag and Push docker image

```
[ec2-user@ip-172-31-43-105 ~]$ sudo docker tag nodeapp:1.0 public.ecr.aws/p6z1k1w3/nodeapp:1.0

[ec2-user@ip-172-31-43-105 ~]$ sudo docker push public.ecr.aws/p6z1k1w3/nodeapp:1.0
The push refers to repository [public.ecr.aws/p6z1k1w3/nodeapp]
db93e2d9b1f9: Pushed 
de66896f030b: Pushed 
abfac3482920: Pushed 
a6bd4d31950d: Pushed 
69bca5427c67: Pushed 
e0731642d6ea: Pushed 
47033e75bc75: Pushed 
994393dc58e7: Pushed 
1.0: digest: sha256:cb39c9024fde4bcefe92bf1d04cadf9240a05a658adb6ac199103863a1233c20 size: 1990
```

### Create namespace in kubernates
```
kubectl create ns app
namespace/app created
```
#### Create Deployment of Application

```
[ec2-user@ip-172-31-43-105 ~]$ kubectl create deployment nodeapp --image=public.ecr.aws/p6z1k1w3/nodeapp:1.0 --namespace app
deployment.apps/nodeapp created
```

### Verify deployment

```
kubectl get pods --namespace app
NAME                       READY   STATUS    RESTARTS   AGE
nodeapp-67b8f5bff7-gpdkm   1/1     Running   0          115s
```

### Create service for traffic distribution

```
kubectl expose deployment nodeapp --port 3000 -n app 
service/nodeapp created
```
###



## Create metrices
 
```
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml 
serviceaccount/metrics-server created
clusterrole.rbac.authorization.k8s.io/system:aggregated-metrics-reader created
clusterrole.rbac.authorization.k8s.io/system:metrics-server created
rolebinding.rbac.authorization.k8s.io/metrics-server-auth-reader created
clusterrolebinding.rbac.authorization.k8s.io/metrics-server:system:auth-delegator created
clusterrolebinding.rbac.authorization.k8s.io/system:metrics-server created
service/metrics-server created
deployment.apps/metrics-server created
apiservice.apiregistration.k8s.io/v1beta1.metrics.k8s.io created
```

### Verify metrices applied or not

``` 
kubectl get deployment metrics-server -n kube-system
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
metrics-server   0/1     1            0           16s
```
### Check pod metrices

```
kubectl top pods -n app
NAME                       CPU(cores)   MEMORY(bytes)   
nodeapp-67b8f5bff7-bc52n   1m           14Mi            
nodeapp-67b8f5bff7-gpdkm   1m           14Mi       
```
### Check node metrices
```
[ec2-user@ip-172-31-43-105 kubernates-assignment]$ kubectl top nodes -n app
NAME                                           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
ip-172-31-14-142.ap-south-1.compute.internal   60m          3%     598Mi           17%       
ip-172-31-20-160.ap-south-1.compute.internal   53m          2%     579Mi           17%    
```



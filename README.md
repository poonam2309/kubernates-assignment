# kubernates-assignment
Deploy Nodejs application in kubernates





```[ec2-user@ip-172-31-43-105 ~]$ aws ecr-public get-login-password --region us-east-1 | sudo docker login --username AWS --password-stdin public.ecr.aws/p6z1k1w3
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store

Login Succeeded
```
sudo docker tag nodeapp:latest public.ecr.aws/p6z1k1w3/kubernates:latest
[ec2-user@ip-172-31-43-105 ~]$ sudo docker tag nodeapp:1.0 public.ecr.aws/p6z1k1w3/nodeapp:1.0
[ec2-user@ip-172-31-43-105 ~]$ docker push public.ecr.aws/p6z1k1w3/nodeapp:1.0
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Post "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/images/public.ecr.aws/p6z1k1w3/nodeapp/push?tag=1.0": dial unix /var/run/docker.sock: connect: permission denied
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


kubectl create ns app
namespace/app created

[ec2-user@ip-172-31-43-105 ~]$ kubectl create deployment nodeapp --image=public.ecr.aws/p6z1k1w3/nodeapp:1.0 --namespace app
deployment.apps/nodeapp created

 kubectl get pods --namespace app
NAME                       READY   STATUS    RESTARTS   AGE
nodeapp-67b8f5bff7-gpdkm   1/1     Running   0          115s


kubectl top pods -n app
NAME                       CPU(cores)   MEMORY(bytes)   
nodeapp-67b8f5bff7-bc52n   1m           14Mi            
nodeapp-67b8f5bff7-gpdkm   1m           14Mi            
[ec2-user@ip-172-31-43-105 kubernates-assignment]$ kubectl top nodes -n app
NAME                                           CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
ip-172-31-14-142.ap-south-1.compute.internal   60m          3%     598Mi           17%       
ip-172-31-20-160.ap-south-1.compute.internal   53m          2%     579Mi           17%    


## Create metrices
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


kubectl get deployment metrics-server -n kube-system
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
metrics-server   0/1     1            0           16s


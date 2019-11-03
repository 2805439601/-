<?php
    /**
     * 单文件上传
     * @param  [string] $fileName [文件名]
     * @param  [string] $path     [上传的路径](绝对路径)
     * @return [string]           [文件保存的路径]
     */
    function upload($fileName = null,$path = null)
    {
        if(empty($_FILES[$fileName]))
        {
            echo '找不到文件,请传正确的文件名称';
            exit();
        }
        
        switch ($_FILES[$fileName]['error'])
        {
            case 1:
            case 2:
                return '文件的大小超过限制';
                break;
            case 3:
                return '文件上传失败';
                break;
            case 4:
                return '请上传文件';
                break;
            case 6:
            case 7:
                return '服务器发生错误，请重新上传';
                break;
            default:
                  //当天日期
                  $day = date('Ymd',time());

                  //判断传的路径是否正确
                  if(isset($path))
                  {
                      $str = preg_replace("/\\\/",'/',substr($path,strlen($path) - 1,1));
                      if($str != '/')
                      {
                          $path = $path . '/';
                      }
                  }
                  //文件保存路径 默认网站的根目录
                  $path = $path ? $_SERVER['DOCUMENT_ROOT'].preg_replace("/\\\/",'/',$path) : $_SERVER['DOCUMENT_ROOT'].'/Uploads/';
                  
                  //文件不存在则创建文件
                  if(!file_exists($path))
                  {
                      mkdir($path);
                  }
                  //创建当前日期文件
                  $savePath = $path . $day .'/';
                  //文件不存在则创建文件
                  if(!file_exists($savePath))
                  {
                      mkdir($savePath);
                  }
                  //文件名称
                  $file_name = $day.uniqid().md5(uniqid()).strrchr($_FILES[$fileName]['name'],'.');

                  //保存的路径
                  $filePath = $savePath.$file_name;
                
                  //移动文件
                  $res = move_uploaded_file($_FILES[$fileName]['tmp_name'],$filePath);
                  if(!$res)
                  {
                      return false;
                  }
                   //网站根目录
                   $realmName = preg_replace("/\//","\/",$_SERVER['DOCUMENT_ROOT']);
                   //上传成功的路径
                   $uploadPath = preg_replace("/{$realmName}/",'',$filePath);      
                   //返回上传成功的路径
                   return $uploadPath;
                   break;
        }
    
    }
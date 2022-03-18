/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove this
/* eslint-disable @typescript-eslint/no-shadow*/ // TODO: remove this
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import PPLabelPageContainer from '@/components/PPLabelPage/PPLabelPageContainer';
import PPToolBarButton from '@/components/PPLabelPage/PPToolBarButton';
import PPToolBar from '@/components/PPLabelPage/PPToolBar';
import PPLabelList from '@/components/PPLabelPage/PPLabelList';
import PPStage from '@/components/PPLabelPage/PPStage';
import type { Label } from '@/models/label';
import PPAnnotationList from '@/components/PPLabelPage/PPAnnotationList';
import type { Annotation } from '@/models/annotation';
import PPRectangle from '@/components/PPLabelPage/PPRectangle';
import drawRectangle from '@/components/PPLabelPage/PPRectangle/drawRectangle';
import { Button, Progress, Spin, message } from 'antd';
import { PageInit } from '@/services/utils';

export type ToolType = 'polygon' | 'mover' | undefined;

const MOST_HISTORY_STEPS = 40;

type HistoryType = {
  index: number;
  items: {
    currentAnnotation?: Annotation<any>;
    annotations: Annotation<any>[];
  }[];
};

const Page: React.FC = () => {
  const [loading, setLoading, scale, annotation, task, data, project, label] = PageInit(
    useState,
    useEffect,
    {
      label: { oneHot: true },
      effectTrigger: {},
    },
  );
  const [currentTool, setCurrentTool] = useState<ToolType>(undefined);
  const [currentLabel, setCurrentLabel] = useState<Label>({ color: '', name: '' });
  const [currentAnnotation, setCurrentAnnotationRaw] = useState<Annotation<any>>();
  const [annotations, setAnnotations] = useState<Annotation<any>[]>([]);

  const setCurrentAnnotation = (anno?: Annotation<any>) => {
    setCurrentAnnotationRaw(anno);
    if (anno?.label) setCurrentLabel(anno.label);
  };

  useEffect(() => {
    localStorage.removeItem('history');
    recordHistory([]);
  }, []);

  function recordHistory(annos: Annotation<any>[], anno?: Annotation<any>) {
    const historyStr = localStorage.getItem('history');
    const history: HistoryType = historyStr ? JSON.parse(historyStr) : { index: -1, items: [] };
    const newItem = { currentAnnotation: anno, annotations: annos };
    if (JSON.stringify(history.items[history.index]) == JSON.stringify(newItem)) {
      return;
    }
    const earliestIndex =
      history.index > MOST_HISTORY_STEPS ? history.index - MOST_HISTORY_STEPS : 0;
    const itemsToKeep = history.items.splice(
      earliestIndex,
      history.index == 0 ? 1 : history.index + 1,
    );
    history.items = itemsToKeep.concat([newItem]);
    if (history.index <= MOST_HISTORY_STEPS) history.index++;
    else history.index = MOST_HISTORY_STEPS + 1;
    localStorage.setItem('history', JSON.stringify(history));
  }

  const forwardHistory = () => {
    const historyStr = localStorage.getItem('history');
    if (!historyStr) {
      return;
    }
    const history: HistoryType = JSON.parse(historyStr);
    if (!history) {
      return;
    }
    if (history.index >= history.items.length - 1) {
      return;
    }
    history.index++;
    localStorage.setItem('history', JSON.stringify(history));
    const item = history.items[history.index];
    setCurrentAnnotationRaw(item.currentAnnotation);
    setAnnotations(item.annotations);
  };

  const backwardHistory = () => {
    const historyStr = localStorage.getItem('history');
    if (!historyStr) return;
    const history: HistoryType = JSON.parse(historyStr);
    if (!history || !history.index) return;
    if (history.index <= 0) return; // already the latest
    history.index--;
    localStorage.setItem('history', JSON.stringify(history));
    const item = history.items[history.index];
    setCurrentAnnotationRaw(item.currentAnnotation);
    setAnnotations(item.annotations);
  };

  const onAnnotationModify = (annotation: Annotation<any>) => {
    const newAnnos: Annotation<any>[] = [];
    for (let i = 0; i < annotations.length; i++) {
      if (annotations[i].annotationId == annotation.annotationId) {
        newAnnos.push(annotation);
      } else {
        newAnnos.push(annotations[i]);
      }
    }
    setCurrentAnnotation(annotation);
    setAnnotations(newAnnos);
  };

  const polygon = drawRectangle({
    currentLabel: currentLabel,
    currentTool: currentTool,
    annotations: annotations,
    currentAnnotation: currentAnnotation,
    onAnnotationAdd: (annotation) => {
      const newAnnos = annotations.concat([annotation]);
      setAnnotations(newAnnos);
      if (!currentAnnotation) setCurrentAnnotation(annotation);
    },
    onAnnotationModify: onAnnotationModify,
    onMouseUp: () => {
      recordHistory(annotations, currentAnnotation);
    },
  });

  const dr = polygon;

  return (
    <PPLabelPageContainer className={styles.det}>
      <PPToolBar>
        <PPRectangle
          active={currentTool == 'polygon'}
          onClick={() => {
            setCurrentTool('polygon');
            setCurrentAnnotation(undefined);
          }}
        >
          Rectangle
        </PPRectangle>
        <PPToolBarButton imgSrc="./pics/buttons/edit.png">Edit</PPToolBarButton>
        <PPToolBarButton
          imgSrc="./pics/buttons/zoom_in.png"
          onClick={() => {
            scale.change(0.1);
          }}
        >
          Zoom in
        </PPToolBarButton>
        <PPToolBarButton
          imgSrc="./pics/buttons/zoom_out.png"
          onClick={() => {
            scale.change(-0.1);
          }}
        >
          Zoom out
        </PPToolBarButton>
        <PPToolBarButton
          imgSrc="./pics/buttons/save.png"
          onClick={() => {
            message.info("Annotations are saved automatically. You don't need to click save.");
          }}
        >
          Save
        </PPToolBarButton>
        <PPToolBarButton
          imgSrc="./pics/buttons/move.png"
          onClick={() => {
            setCurrentTool('mover');
          }}
        >
          Move
        </PPToolBarButton>
        <PPToolBarButton
          imgSrc="./pics/buttons/prev.png"
          onClick={() => {
            backwardHistory();
          }}
        >
          Undo
        </PPToolBarButton>
        <PPToolBarButton
          imgSrc="./pics/buttons/next.png"
          onClick={() => {
            forwardHistory();
          }}
        >
          Redo
        </PPToolBarButton>
        <PPToolBarButton imgSrc="./pics/buttons/clear_mark.png">Clear Mark</PPToolBarButton>
      </PPToolBar>
      <div id="dr" className={styles.mainStage}>
        <Spin tip="loading" spinning={loading}>
          <div className={styles.draw}>
            <PPStage
              width={document.getElementById('dr')?.clientWidth}
              scale={scale.curr}
              annotations={annotations}
              currentTool={currentTool}
              currentAnnotation={currentAnnotation}
              setCurrentAnnotation={setCurrentAnnotation}
              onAnnotationModify={onAnnotationModify}
              onAnnotationModifyComplete={() => {
                recordHistory(annotations, currentAnnotation);
              }}
              onMouseDown={dr.onMouseDown}
              onMouseMove={dr.onMouseMove}
              onMouseUp={dr.onMouseUp}
              createPolygonFunc={polygon.createElementsFunc}
              imgSrc={data.imgSrc}
            />
          </div>
          <div className={styles.pblock}>
            <div className={styles.progress}>
              <Progress percent={task.progress} status="active" />
              {task.currIdx} {task.all?.length} {task.finished}
            </div>
          </div>
        </Spin>
      </div>
      <PPToolBar disLoc="right">
        <PPToolBarButton imgSrc="./pics/buttons/data_division.png">Divide Data</PPToolBarButton>
        <PPToolBarButton imgSrc="./pics/buttons/export.png">Export</PPToolBarButton>
        <PPToolBarButton imgSrc="./pics/buttons/next.png" onClick={task.nextTask}>
          Next
        </PPToolBarButton>
        <PPToolBarButton imgSrc="./pics/buttons/prev.png" onClick={task.prevTask}>
          Prev
        </PPToolBarButton>
      </PPToolBar>
      <div className={styles.rightSideBar}>
        <div className={styles.determinOutline}>
          <Button
            style={{ height: 40, fontSize: '0.75rem' }}
            type="primary"
            block
            onClick={() => {
              setCurrentAnnotation(undefined);
            }}
          >
            Determine Outline
          </Button>
        </div>
        <PPLabelList
          labels={label.all}
          onLabelSelect={(selected) => {
            label.onSelect(selected);
            setCurrentLabel(selected);
            setCurrentAnnotation(undefined);
          }}
          onLabelModify={() => {}}
          onLabelDelete={label.remove}
          onLabelAdd={(lab) => label.create({ ...lab, projectId: project.curr.projectId })}
        />
        <PPAnnotationList
          annotations={annotation.all}
          onAnnotationSelect={
            //   (selectedAnno) => {
            //   if (!selectedAnno?.delete) setCurrentAnnotation(selectedAnno);
            // }
            annotation.onSelect
          }
          onAnnotationAdd={() => {}}
          onAnnotationModify={() => {}}
          onAnnotationDelete={
            // (annotation: Annotation<any>) => {
            // setAnnotations(annotations.filter((x) => x.annotationId != annotation.annotationId));
            // setCurrentAnnotation(undefined);
            // }
            annotation.remove
          }
        />
      </div>
    </PPLabelPageContainer>
  );
};

export default Page;
